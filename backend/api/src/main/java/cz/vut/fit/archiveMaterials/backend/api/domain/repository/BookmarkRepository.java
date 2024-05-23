package cz.vut.fit.archiveMaterials.backend.api.domain.repository;


import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Bookmark;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for accessing Bookmark entities from the database.
 */
@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long>,
        JpaSpecificationExecutor<Bookmark> {

    /**
     * Retrieves all bookmarks associated with a specific ArchivalRecord.
     *
     * @param archivalRecordId The ID of the ArchivalRecord to retrieve bookmarks for.
     * @return A list of Bookmark objects associated with the specified ArchivalRecord.
     */
    List<Bookmark> findAllByArchivalRecordId(Long archivalRecordId);

    /**
     * Retrieves a bookmark by its scan URL and user ID.
     *
     * @param scanUrl The URL of the scan associated with the bookmark.
     * @return An Optional containing the found Bookmark, or empty if not found.
     */
    Optional<Bookmark> findByScanUrl(String scanUrl);
}