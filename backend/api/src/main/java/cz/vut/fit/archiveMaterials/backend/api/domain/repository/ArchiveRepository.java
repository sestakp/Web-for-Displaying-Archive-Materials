package cz.vut.fit.archiveMaterials.backend.api.domain.repository;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing {@link Archive} entities.
 *
 * <p>This interface extends {@link JpaRepository} to provide basic CRUD operations for the {@link Archive} entity.</p>
 */
@Repository
public interface ArchiveRepository extends JpaRepository<Archive, Long> {

    /**
     * Finds an archive by its abbreviation, ignoring case.
     *
     * <p>This method returns an {@link Optional} containing the found archive based on the provided abbreviation,
     * ignoring case.</p>
     *
     * @param abbreviation The abbreviation of the archive to find.
     * @return An {@link Optional} containing the found archive.
     */
    Optional<Archive> findByAbbreviationIgnoreCase(String abbreviation);

    /**
     * Retrieves an Archive entity by its name, ignoring case.
     *
     * @param name The name of the Archive to retrieve.
     * @return An Optional containing the found Archive, or empty if not found.
     */
    Optional<Archive> findByNameIgnoreCase(String name);

    /**
     * Finds archives whose name contains the specified partial name.
     *
     * <p>This method returns a {@link List} of archives that have names containing the specified partial name.</p>
     *
     * @param partialName The partial name to search for within archive names.
     * @return A {@link List} of archives whose names contain the specified partial name.
     */
    List<Archive> findByNameContaining(String partialName);

}
