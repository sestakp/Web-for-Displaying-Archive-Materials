package cz.vut.fit.archiveMaterials.backend.api.controller;

import cz.vut.fit.archiveMaterials.backend.api.ArchivalRecordsControllerApi;
import cz.vut.fit.archiveMaterials.backend.api.controller.mapper.ArchivalRecordDtoMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.dto.ScansResult;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordCreateDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordPageDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordScansDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import cz.vut.fit.archiveMaterials.backend.api.dto.CountsByMunicipalityDto;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchiveNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.service.ArchivalRecordService;
import cz.vut.fit.archiveMaterials.backend.core.controller.RestControllerExceptionHandler;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller class for managing Archival Records.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ArchivalRecordController implements ArchivalRecordsControllerApi {

    private final ArchivalRecordService service;
    private final ArchivalRecordPersistenceService archivalRecordPersistenceService;
    private final ArchivalRecordDtoMapper mapper;

    /**
     * Upserts an Archival Record.
     *
     * @param archivalRecordCreateDto DTO containing data for upserting an Archival Record.
     * @return ResponseEntity with ArchivalRecordDetailDto and HTTP status.
     * @throws ArchiveNotFoundException if the archive is not found.
     */
    @Override
    public ResponseEntity<ArchivalRecordDetailDto> upsert(@Valid ArchivalRecordCreateDto archivalRecordCreateDto)
            throws ArchiveNotFoundException {

        ArchivalRecord archivalRecord = mapper.map(archivalRecordCreateDto);
        ArchivalRecord upserted = service.upsert(archivalRecord);
        ArchivalRecordDetailDto dto = mapper.map(upserted);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    /**
     * Deletes an Archival Record by ID.
     *
     * @param id ID of the Archival Record to be deleted.
     * @return ResponseEntity with no content and HTTP status.
     * @throws Exception if an error occurs during deletion.
     */
    @Override
    public ResponseEntity<Void> deleteArchivalRecord(Long id) throws Exception {
        log.info("deleteArchivalRecord {}", id);
        service.delete(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Retrieves a page of archival records based on specified criteria.
     *
     * @param pageSize            The size of the page.
     * @param page                The page number.
     * @param typeOfRecord        The type of archival record to filter by.
     * @param q                   The query string for searching records.
     * @param archiveAbbr         The abbreviation of the archive to filter records by.
     * @param yearFrom            The starting year for filtering records by year.
     * @param yearTo              The ending year for filtering records by year.
     * @param country             The country to filter records by.
     * @param region              The region to filter records by.
     * @param district            The district to filter records by.
     * @param municipality        The municipality to filter records by.
     * @param borough             The borough to filter records by.
     * @param onlyFavourites      Flag indicating to filter only records marked as favourites.
     * @param onlyWithMyNotes     Flag indicating to filter only records with user's notes.
     * @param onlyWithMyBookmarks Flag indicating to filter only records bookmarked by user.
     * @param onlyDigitalized     Flag indicating to filter only digitalized records.
     * @return ResponseEntity with the DTO containing a page of archival records.
     */
    @Override
    public ResponseEntity<ArchivalRecordPageDto> getAllArchivalRecords(@Valid Integer pageSize, @Valid Integer page,
            @Valid ArchivalRecordTypeEnum typeOfRecord, @Valid String q, @Valid String archiveAbbr,
            @Valid Integer yearFrom, @Valid Integer yearTo, @Valid String country, @Valid String region,
            @Valid String district, @Valid String municipality, @Valid String borough, @Valid Boolean onlyFavourites,
            @Valid Boolean onlyWithMyNotes, @Valid Boolean onlyWithMyBookmarks, @Valid Boolean onlyDigitalized,
            @Valid String sortField, @Valid Integer sortOrder) {
        log.info("getAllArchivaRecords");

        var archivalRecordsPage = service.getAllArchivalRecord(pageSize, page, typeOfRecord, q, archiveAbbr, yearFrom,
                yearTo, country, region, district, municipality, borough, onlyFavourites, onlyWithMyNotes,
                onlyWithMyBookmarks, onlyDigitalized, sortField, sortOrder);

        var dto = mapper.map(archivalRecordsPage);
        return ResponseEntity.ok(dto);
    }

    /**
     * Retrieves counts by municipality based on the specified criteria.
     *
     * @param country The name of the country.
     * @param region The name of the region.
     * @param district The name of the district.
     * @param municipality The name of the municipality.
     * @param borough The name of the borough.
     * @return A ResponseEntity containing a CountsByMunicipalityDto object with the counts information.
     */
    @Override
    public ResponseEntity<CountsByMunicipalityDto> getCountsByMunicipality(@Valid String country, @Valid String region,
            @Valid String district, @Valid String municipality, @Valid String borough) {
        var dto = service.GetCountsByMunicipality(country, region, district, municipality, borough);
        return ResponseEntity.ok(dto);
    }

    /**
     * Retrieves an Archival Record by ID.
     *
     * @param id ID of the Archival Record to be retrieved.
     * @return ResponseEntity with ArchivalRecordDetailDto and HTTP status.
     */
    @Override
    public ResponseEntity<ArchivalRecordDetailDto> getArchivalRecord(Long id) {
        log.info("getArchivalRecord {}", id);
        try {
            var dto = service.getArchivalRecordById(id);
            return ResponseEntity.ok(dto);
        } catch (ObjectException e) {
            return RestControllerExceptionHandler.handleException(e);
        }
    }

    /**
     * Retrieves all scans associated with an archival record.
     *
     * @param id The ID of the archival record.
     * @return ResponseEntity with the DTO containing information about all scans.
     */
    @Override
    public ResponseEntity<ArchivalRecordScansDto> getAllScansByArchivalRecord(Long id) {
        log.info("getAllScansByArchivalRecordId: {}", id);
        ScansResult scans = archivalRecordPersistenceService.getAllScansByArchivalRecord(id);
        ArchivalRecordScansDto dto = mapper.mapScans(scans);
        return ResponseEntity.ok(dto);
    }
}
