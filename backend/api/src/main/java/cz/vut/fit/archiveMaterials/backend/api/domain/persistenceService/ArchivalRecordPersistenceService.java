package cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService;

import cz.vut.fit.archiveMaterials.backend.api.domain.comparers.ScanComparator;
import cz.vut.fit.archiveMaterials.backend.api.domain.dto.ScansResult;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Language;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ArchivalRecordRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.LanguageRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.LocationRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ScanRepository;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for handling persistence operations related to {@link ArchivalRecord}. This class provides methods for
 * persisting, querying, and deleting archival records, as well as asynchronous retrieval of locations and languages
 * associated with archival records.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ArchivalRecordPersistenceService {

    private final ArchivalRecordRepository repository;
    private final LocationRepository locationRepository;
    private final ScanRepository scanRepository;
    private final LanguageRepository languageRepository;

    /**
     * Persists the given {@link ArchivalRecord} entity.
     *
     * @param archivalRecord The ArchivalRecord entity to be persisted.
     * @return The persisted ArchivalRecord entity.
     */
    @Transactional
    public ArchivalRecord persist(ArchivalRecord archivalRecord) {
        log.debug("persist: {}", archivalRecord);
        return repository.save(archivalRecord);
    }

    /**
     * Gets an ArchivalRecord by its ID.
     *
     * @param id The ID of the ArchivalRecord.
     * @return The found ArchivalRecord entity.
     * @throws ArchivalRecordNotFoundException If the archival record is not found.
     */
    public ArchivalRecord getArchivalRecordById(Long id) throws ArchivalRecordNotFoundException {
        log.debug("getArchivalRecordById {}", id);
        if (id != null) {
            Optional<ArchivalRecord> found = repository.findById(id);
            if (found.isPresent()) {
                return found.get();
            }
        }
        throw new ArchivalRecordNotFoundException("Archivny zaznam nebol najdeny");
    }

    /**
     * Tries to find an archival record by its link in the repository.
     *
     * @param currentRecord The archival record to find.
     * @return The archival record found in the repository, or the provided currentRecord if not found.
     */
    public ArchivalRecord tryFindByLink(ArchivalRecord currentRecord) {
        log.debug("findByLink {}", currentRecord.getLink());
        if (currentRecord.getLink() != null) {
            var storedRecordOptional = repository.findByLink(currentRecord.getLink());

            if (storedRecordOptional.isPresent()) {
                return storedRecordOptional.get();
            }
        }
        return currentRecord;
    }

    /**
     * Deletes an ArchivalRecord by its ID.
     *
     * @param id The ID of the ArchivalRecord to be deleted.
     * @throws IllegalArgumentException        If the provided ID is null.
     * @throws ArchivalRecordNotFoundException When archival record with this id is not found
     */
    public void delete(Long id) throws IllegalArgumentException, ArchivalRecordNotFoundException {
        log.debug("delete: {}", id);
        if (id != null) {
            try {
                repository.deleteById(id);
                log.debug("ArchivalRecord with ID {} deleted successfully.", id);
            } catch (DataAccessException e) {
                log.error("Error deleting ArchivalRecord with ID {}", id, e);
                throw new ArchivalRecordNotFoundException(
                        String.format("Error deleting ArchivalRecord. See logs for details. %s", e.toString()));
            }
        } else {
            throw new IllegalArgumentException("ID cannot be null for deletion.");
        }
    }

    /**
     * Retrieves a list of locations associated with an archival record.
     *
     * @param archivalRecord The archival record for which to retrieve locations.
     * @return A list of locations associated with the archival record.
     */
    public List<Location> getLocationsForArchivalRecord(ArchivalRecord archivalRecord) {

        var newLocations = new ArrayList<Location>();

        if (archivalRecord.getLocations() != null) {
            for (var loc : archivalRecord.getLocations()) {
                log.debug(
                        "findByCountryAndRegionAndDistrictAndMunicipalityAndBoroughAndLatitudeAndLongitude: {} {} {} {} {} {} {}",
                        loc.getCountry(), loc.getRegion(), loc.getDistrict(),
                        loc.getMunicipality(), loc.getBorough(),
                        loc.getLatitude(), loc.getLongitude());

                if (loc.getCountry() == null && loc.getRegion() == null && loc.getDistrict() == null
                        && loc.getMunicipality() == null && loc.getBorough() == null) {
                    continue;
                }

                if (loc.getBorough() != null && loc.getBorough().equals(loc.getMunicipality())) {
                    loc.setBorough(null);
                }

                var storedLocs = locationRepository.findAllByCountryAndRegionAndDistrictAndMunicipalityAndBorough(
                        loc.getCountry(), loc.getRegion(), loc.getDistrict(),
                        loc.getMunicipality(), loc.getBorough());

                Location finalLoc = null;

                for (var storedLoc : storedLocs) {

                    if (storedLoc.getLatitude() == null && storedLoc.getLongitude() == null
                            && loc.getLatitude() == null && loc.getLongitude() == null) {
                        finalLoc = storedLoc;
                        break;
                    }

                    if (storedLoc.getLatitude() == null || storedLoc.getLongitude() == null
                            || loc.getLatitude() == null || loc.getLongitude() == null) {
                        continue;
                    }

                    var latDiff = Math.abs(storedLoc.getLatitude() - loc.getLatitude());
                    var lonDiff = Math.abs(storedLoc.getLongitude() - loc.getLongitude());

                    if (latDiff < 0.2 && lonDiff < 0.2) {
                        finalLoc = storedLoc;
                        break;
                    }
                }

                if (finalLoc != null) {
                    if (!newLocations.contains(finalLoc)) {
                        newLocations.add(finalLoc);
                    }
                } else {
                    if (!newLocations.contains(loc)) {
                        newLocations.add(loc);
                    }
                }
            }
        }
        return newLocations;
    }

    /**
     * Retrieves the set of languages associated with an archival record, combining both stored languages and those
     * present in the archival record.
     *
     * @param archivalRecord The archival record for which to retrieve languages.
     * @return A set of languages associated with the archival record.
     */
    public Set<Language> getLanguagesForArchivalRecord(ArchivalRecord archivalRecord) {

        var languages = archivalRecord.getLanguages().stream()
                .map(Language::getName)
                .collect(Collectors.toSet());

        var storedLanguages = languageRepository.findAllByNameIsIn(languages);

        var archivalRecordLanguagesNew = archivalRecord.getLanguages();

        var iterator = archivalRecordLanguagesNew.iterator();
        while (iterator.hasNext()) {
            var i = iterator.next();
            if (storedLanguages.contains(i)) {
                iterator.remove();
            }
        }
        storedLanguages.addAll(archivalRecordLanguagesNew);

        return storedLanguages;
    }

    /**
     * Retrieves all scans associated with a given archival record.
     *
     * @param archivalRecordId The ID of the archival record.
     * @return A ScansResult object containing a sorted list of scans.
     */
    public ScansResult getAllScansByArchivalRecord(Long archivalRecordId) {
        log.debug("getAllScansByArchivalRecord {}", archivalRecordId);
        ScansResult scansResult = new ScansResult();
        if (archivalRecordId != null) {
            var scans = scanRepository.findAllByArchivalRecordId(archivalRecordId);
            if (!scans.isEmpty()) {
                scans.sort(new ScanComparator());
                scansResult.setScans(scans);
                return scansResult;
            }
        }
        scansResult.setScans(Collections.emptyList());
        return scansResult;
    }
}
