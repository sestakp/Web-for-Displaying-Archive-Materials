package cz.vut.fit.archiveMaterials.backend.api.service;

import cz.vut.fit.archiveMaterials.backend.api.controller.mapper.ArchivalRecordDtoMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.dto.ArchivalRecordPage;
import cz.vut.fit.archiveMaterials.backend.api.domain.elasticSearchRepository.ArchivalRecordElasticSearchRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.mapper.ArchivalRecordMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import cz.vut.fit.archiveMaterials.backend.api.dto.CountsByMunicipalityDto;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchiveNotFoundException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArchivalRecordService {

    private final ArchivalRecordPersistenceService archivalRecordPersistenceService;
    private final ArchivePersistenceService archivePersistenceService;
    private final UserPersistenceService userPersistenceService;
    private final ArchivalRecordMapper archivalRecordMapper;
    private final ArchivalRecordDtoMapper archivalRecordDtoMapper;
    private final ArchivalRecordElasticSearchRepository archivalRecordElasticSearchRepository;

    /**
     * Upserts (inserts or updates) an ArchivalRecord entity in the database. Uses a transactional and retryable
     * approach to handle concurrent transactions, especially when adding the same location via two concurrent
     * transactions.
     *
     * @param archivalRecord - The ArchivalRecord entity to upsert.
     * @return The upserted ArchivalRecord entity.
     * @throws Error If the maximum number of retry attempts is exceeded.
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    @Retryable(
            maxAttempts = 3,
            value = SQLIntegrityConstraintViolationException.class,
            backoff = @Backoff(delay = 1000, maxDelay = 5000, multiplier = 2)
    )
    public ArchivalRecord upsert(ArchivalRecord archivalRecord) throws ArchiveNotFoundException {

        log.debug("upsert archivalRecord: {}", archivalRecord);

        archivalRecord.setLanguages(archivalRecordPersistenceService.getLanguagesForArchivalRecord(archivalRecord));

        archivalRecord.setLocations(archivalRecordPersistenceService.getLocationsForArchivalRecord(archivalRecord));

        archivalRecord.setArchive(archivePersistenceService.findByName(archivalRecord.getArchive().getName()));

        var storedArchivalRecord = archivalRecordPersistenceService.tryFindByLink(archivalRecord);

        if (storedArchivalRecord.getId() != null) {
            archivalRecord.setId(storedArchivalRecord.getId());
            archivalRecordMapper.update(archivalRecord, storedArchivalRecord);
        }

        var orderNumber = 1;
        for (var scan : archivalRecord.getScans()) {
            scan.setOrderNumber(orderNumber);
            scan.setArchivalRecord(archivalRecord);
            orderNumber += 1;
        }

        archivalRecord.setNumberOfScans(archivalRecord.getScans().size());

        archivalRecord.setDigitalized(archivalRecord.getNumberOfScans() > 0);
        archivalRecord.setLastUpdated(LocalDateTime.now());
        return archivalRecordPersistenceService.persist(archivalRecord);
    }

    /**
     * Deletes an ArchivalRecord entity from the database based on the provided ID. The deletion is performed within a
     * transactional context.
     *
     * @param id - The ID of the ArchivalRecord entity to be deleted.
     * @throws IllegalArgumentException        If the provided ID is null.
     * @throws ArchivalRecordNotFoundException When archival record with this id is not found
     */
    @Transactional
    public void delete(Long id) throws IllegalArgumentException, ArchivalRecordNotFoundException {
        log.debug("delete archivalRecord: {}", id);
        archivalRecordPersistenceService.delete(id);
    }


    /**
     * Retrieves a page of ArchivalRecord entities based on the provided request parameters. The retrieval is performed
     * within a read-only transactional context.
     *
     * @return The resulting page of ArchivalRecord entities.
     */
    @Transactional(readOnly = true)
    public ArchivalRecordPage getAllArchivalRecord(Integer pageSize, Integer page, ArchivalRecordTypeEnum typeOfRecord,
            String q, String archiveAbbr, Integer yearFrom,
            Integer yearTo, String country, String region, String district, String municipality, String borough,
            boolean onlyFavourites, boolean onlyWithMyNotes, boolean onlyWithMyBookmarks, boolean onlyDigitalized,
            String sortField, Integer sortOrder) {
        log.debug("getAllArchivalRecord with pageable: {} {}", page, pageSize);

        String email = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if ((onlyFavourites || onlyWithMyBookmarks || onlyWithMyNotes)
                && authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {
            var userOrNull = userPersistenceService.findByEmailAndIsVerified(userFromCredentials.getEmail());
            if (!userOrNull.isEmpty()) {
                var user = userOrNull.get();

                email = user.getEmail();
            }
        }
        return archivalRecordElasticSearchRepository.fullTextSearch(pageSize, page, typeOfRecord, q, archiveAbbr,
                yearFrom, yearTo, country, region, district, municipality, borough, email, onlyWithMyNotes,
                onlyWithMyBookmarks, onlyDigitalized, sortField, sortOrder);
    }

    /**
     * Retrieves counts by municipality based on the specified criteria.
     *
     * @param country      The country name.
     * @param region       The region name.
     * @param district     The district name.
     * @param municipality The municipality name.
     * @param borough      The borough name.
     * @return A CountsByMunicipalityDto object containing counts information.
     */
    @Transactional(readOnly = true)
    public CountsByMunicipalityDto GetCountsByMunicipality(String country, String region, String district,
            String municipality, String borough) {

        return archivalRecordElasticSearchRepository.GetCountsByMunicipality(country, region, district, municipality,
                borough);
    }

    /**
     * Retrieves details of an archival record by its ID.
     *
     * @param id The ID of the archival record.
     * @return An ArchivalRecordDetailDto object containing the details of the archival record.
     * @throws ArchivalRecordNotFoundException If the archival record with the specified ID is not found.
     */
    @Transactional(readOnly = true)
    public ArchivalRecordDetailDto getArchivalRecordById(Long id) throws ArchivalRecordNotFoundException {
        var archivalRecord = archivalRecordPersistenceService.getArchivalRecordById(id);

        var dto = archivalRecordDtoMapper.map(archivalRecord);
        dto.setIsFavourite(false);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {
            var userOrNull = userPersistenceService.findByEmailAndIsVerified(userFromCredentials.getEmail());
            if (!userOrNull.isEmpty()) {

                var user = userOrNull.get();
                for (ArchivalRecord favoriteRecord : user.getFavouriteArchivalRecords()) {
                    if (favoriteRecord.getId().equals(archivalRecord.getId())) {
                        // The archivalRecord with the same id is found in favorites
                        dto.setIsFavourite(true);
                    }
                }
            }
        }

        return dto;
    }
}
