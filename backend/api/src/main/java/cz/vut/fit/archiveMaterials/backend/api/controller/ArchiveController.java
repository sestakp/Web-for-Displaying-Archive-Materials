package cz.vut.fit.archiveMaterials.backend.api.controller;

import cz.vut.fit.archiveMaterials.backend.api.ArchiveControllerApi;
import cz.vut.fit.archiveMaterials.backend.api.dto.*;
import cz.vut.fit.archiveMaterials.backend.api.controller.mapper.ArchiveDtoMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.service.ArchiveService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller class for managing Archives.
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ArchiveController implements ArchiveControllerApi {


    private final ArchiveService service;
    private final ArchivePersistenceService archivePersistenceService;
    private final ArchiveDtoMapper mapper;


    /**
     * Creates a new archive.
     *
     * @param archiveCreateDto The DTO containing information for creating the archive.
     * @return ResponseEntity with the created ArchiveDetailDto.
     * @throws Exception If there is an error during the creation process.
     */
    /*@Override
    public ResponseEntity<ArchiveDetailDto> createArchive(@Valid ArchiveCreateDto archiveCreateDto) throws Exception {
        log.info("createArchive {} ", archiveCreateDto);
        Archive archive = mapper.map(archiveCreateDto);
        Archive created = service.create(archive);
        ArchiveDetailDto dto = mapper.map(created);

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }*/

    /**
     * Deletes an archive by its ID.
     *
     * @param id The ID of the archive to be deleted.
     * @return ResponseEntity indicating the success of the operation.
     * @throws Exception If there is an error during the deletion process.
     */
    /*@Override
    public ResponseEntity<Void> deleteArchive(Long id) throws Exception {
        log.info("deleteArchive {} " ,id);
        service.delete(id);
        return ResponseEntity.ok().build();
    }*/


    /**
     * Retrieves an archive by its abbreviation.
     *
     * @param name The abbreviation of the archive.
     * @return ResponseEntity with the ArchiveDetailDto.
     * @throws Exception If there is an error during the retrieval process.
     */
    @Override
    public ResponseEntity<ArchiveDetailDto> getArchiveByAbbreviation(String name) throws Exception {
        var archive = archivePersistenceService.findByAbbreviation(name);
        var dto = mapper.map(archive);
        return ResponseEntity.ok(dto);
    }

    /**
     * Retrieves detailed information about an archive by its ID.
     *
     * @param id The ID of the archive.
     * @return ResponseEntity with the ArchiveDetailDto.
     * @throws Exception If there is an error during the retrieval process.
     */
    @Override
    public ResponseEntity<ArchiveDetailDto> getArchiveDetail(Long id) throws Exception {
        log.info("getArchive {} ", id);
        Archive archive = archivePersistenceService.getArchiveById(id);
        ArchiveDetailDto dto = mapper.map(archive);
        return ResponseEntity.ok(dto);
    }

    /**
     * Retrieves a list of archives based on the partial name.
     *
     * @param name The partial name to filter archives.
     * @return ResponseEntity with a list of ArchiveDetailDto.
     */
    @Override
    public ResponseEntity<List<ArchiveDetailDto>> getAllArchives(@Valid String name) {
        List<Archive> archives;
        if (name != null) {
            archives = archivePersistenceService.filterArchivesByPartialName(name);
        } else {
            archives = archivePersistenceService.getAllArchives();
        }

        List<ArchiveDetailDto> dtos = mapper.map(archives);
        return ResponseEntity.ok(dtos);
    }

    /**
     * Retrieves basic information about an archive by its ID.
     *
     * @param id The ID of the archive.
     * @return ResponseEntity with the ArchiveDto.
     * @throws Exception If there is an error during the retrieval process.
     */
    @Override
    public ResponseEntity<ArchiveDto> getArchive(Long id) throws Exception {
        log.info("getArchive {} " , id);
        Archive archive = archivePersistenceService.getArchiveById(id);
        ArchiveDto dto = mapper.mapDtoToArchive(archive);
        return ResponseEntity.ok(dto);
    }

    /**
     * Updates an archive by its ID.
     *
     * @param id The ID of the archive to be updated.
     * @param archiveUpdateDto The DTO containing information for updating the archive.
     * @return ResponseEntity with the updated ArchiveDetailDto.
     * @throws Exception If there is an error during the update process.
     */
    /*@Override
    public ResponseEntity<ArchiveDetailDto> updateArchive(Long id, @Valid ArchiveUpdateDto archiveUpdateDto)
            throws Exception {
        log.info("updateArchive id: {} {}" , id, archiveUpdateDto);
        Archive updated = mapper.map(archiveUpdateDto);
        Archive persisted = service.update(id, updated);
        ArchiveDetailDto dto = mapper.map(persisted);
        return ResponseEntity.ok(dto);
    }*/

}
