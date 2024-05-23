package cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Bookmark;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.BookmarkRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.BookmarkNotFoundException;
import java.util.Collection;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service class for managing operations related to bookmark persistence.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookmarkPersistenceService {

    private final BookmarkRepository repository;

    /**
     * Persists a bookmark entity.
     *
     * @param bookmark The bookmark entity to persist.
     * @return The persisted bookmark entity.
     */
    public Bookmark persist(Bookmark bookmark) {
        log.debug("persist: {}", bookmark);

        return repository.save(bookmark);

    }

    /**
     * Retrieves all bookmarks associated with a specific archival record.
     *
     * @param archivalRecordId The ID of the archival record.
     * @return A collection of bookmarks associated with the archival record.
     */
    public Collection<Bookmark> getBookmarksForArchivalRecord(Long archivalRecordId) {

        return repository.findAllByArchivalRecordId(archivalRecordId);
    }

    /**
     * Tries to find a bookmark by its scan URL.
     *
     * @param bookmark The bookmark to find.
     * @return The found bookmark, or the provided bookmark if not found.
     */
    public Bookmark tryFindByScanUrl(Bookmark bookmark) {
        log.debug("tryFindByScanUrlAndUserId {}", bookmark.getScan().getUrl());
        var storedRecordOptional = repository.findByScanUrl(bookmark.getScan().getUrl());

        return storedRecordOptional.orElse(bookmark);

    }

    /**
     * Retrieves a bookmark entity by its ID.
     *
     * @param id The ID of the bookmark to retrieve.
     * @return The retrieved bookmark entity.
     * @throws BookmarkNotFoundException If the bookmark with the specified ID is not found.
     */
    public Bookmark getBookmarkById(Long id) throws BookmarkNotFoundException {
        log.debug("getBookmarkById: {}", id);
        if (id != null){
            Optional<Bookmark> found = repository.findById(id);
            if (found.isPresent()){
                return found.get();
            }
        }
        throw new BookmarkNotFoundException("Bookmark not found.");
    }

    /**
     * Deletes a bookmark entity by its ID.
     *
     * @param id The ID of the bookmark to delete.
     */
    public void delete(Long id) {
        log.debug("delete bookmark: {}", id);
        if (id != null) {
            repository.deleteById(id);
        }
    }
}
