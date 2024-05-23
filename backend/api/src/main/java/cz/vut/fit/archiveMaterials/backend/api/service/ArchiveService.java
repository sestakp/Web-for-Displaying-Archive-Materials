package cz.vut.fit.archiveMaterials.backend.api.service;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.mapper.ArchiveMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchiveNotFoundException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArchiveService {

    private final ArchivePersistenceService archivePersistenceService;
    private final ArchiveMapper archiveMapper;

    /**
     * Creates a new archive.
     *
     * @param archive The archive to be created.
     * @return The created archive.
     */
    @Transactional
    public Archive create(Archive archive) {
        log.debug("create archive: {}", archive);
        archive.setLastUpdated(LocalDateTime.now());
        archive = archivePersistenceService.persist(archive);
        return archive;
    }

    /**
     * Updates an existing archive.
     *
     * @param id      The ID of the archive to be updated.
     * @param updated The updated archive data.
     * @return The updated archive.
     * @throws ArchiveNotFoundException If the archive with the given ID is not found.
     */
    @Transactional
    public Archive update(Long id, Archive updated) throws ArchiveNotFoundException {
        log.debug("update: id {}, updated: {} ", id, updated);
        Archive archive = archivePersistenceService.getArchiveById(id);
        archive.setLastUpdated(LocalDateTime.now());
        archiveMapper.update(updated, archive);
        return archivePersistenceService.persist(archive);
    }

    /**
     * Deletes an archive by its ID.
     *
     * @param id The ID of the archive to be deleted.
     */
    @Transactional
    public void delete(Long id) {
        log.debug("delete archive: {}", id);
        if (id != null) {
            archivePersistenceService.delete(id);
        }
    }

}
