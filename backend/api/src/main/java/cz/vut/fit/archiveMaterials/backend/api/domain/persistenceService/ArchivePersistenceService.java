package cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ArchiveRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchiveNotFoundException;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing operations related to archive persistence.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ArchivePersistenceService {

    private final ArchiveRepository repository;

    /**
     * Persists an archive entity.
     *
     * @param archive The archive entity to persist.
     * @return The persisted archive entity.
     */
    @Transactional
    public Archive persist(Archive archive) {
        log.debug("persist: {}", archive);
        return repository.save(archive);
    }

    /**
     * Retrieves an archive entity by its ID.
     *
     * @param id The ID of the archive to retrieve.
     * @return The retrieved archive entity.
     * @throws ArchiveNotFoundException If the archive with the specified ID is not found.
     */
    public Archive getArchiveById(Long id) throws ArchiveNotFoundException {
        log.debug("getArchiveById {}", id);
        if (id != null) {
            Optional<Archive> found = repository.findById(id);
            if (found.isPresent()) {
                return found.get();
            }
        }
        throw new ArchiveNotFoundException("Archiv s id %s nebol najdeny" + id);
    }

    /**
     * Retrieves all archive entities.
     *
     * @return A list of all archive entities.
     */
    public List<Archive> getAllArchives() {
        log.debug("getAllArchives");
        Sort sort = Sort.by(Direction.ASC, "name");
        return repository.findAll(sort);
    }

    /**
     * Deletes an archive entity by its ID.
     *
     * @param id The ID of the archive to delete.
     */
    public void delete(Long id) {
        log.debug("delete: {}", id);
        if (id != null) {
            repository.deleteById(id);
        }
    }

    /**
     * Retrieves an archive entity by its abbreviation.
     *
     * @param abbreviation The abbreviation of the archive to retrieve.
     * @return The retrieved archive entity.
     * @throws ArchiveNotFoundException If the archive with the specified abbreviation is not found.
     */
    public Archive findByAbbreviation(String abbreviation) throws ArchiveNotFoundException {
        log.debug("findByAbbreviation: {}", abbreviation);

        if (abbreviation != null) {
            var found = repository.findByAbbreviationIgnoreCase(abbreviation);
            if (found.isPresent()) {
                return found.get();
            }
        }
        throw new ArchiveNotFoundException(String.format("Archiv se zkratkou %s nebol najdeny", abbreviation));
    }

    /**
     * Retrieves an archive entity by its name.
     *
     * @param name The name of the archive to retrieve.
     * @return The retrieved archive entity.
     * @throws ArchiveNotFoundException If the archive with the specified name is not found.
     * @throws IllegalArgumentException If the provided name is null.
     */
    public Archive findByName(String name) throws ArchiveNotFoundException, IllegalArgumentException {
        log.debug("find by name archive: {}", name);

        if (name != null) {
            var archiveOptional = repository.findByNameIgnoreCase(name);
            if (archiveOptional.isPresent()) {
                return archiveOptional.get();
            }

            throw new ArchiveNotFoundException("Archive by name not found");
        }

        throw new IllegalArgumentException("Name cannot be null");

    }

    /**
     * Filters archive entities by partial name.
     *
     * @param partialName The partial name to filter archives.
     * @return A list of archive entities matching the partial name.
     */
    public List<Archive> filterArchivesByPartialName(String partialName) {
        log.debug("filterArchivesByPartialName: {}", partialName);
        return repository.findByNameContaining(partialName);
    }
}
