package cz.vut.fit.archiveMaterials.backend.api.service;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Bookmark;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.BookmarkPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ScanPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.BookmarkNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.ScanNotFoundException;
import java.time.LocalDateTime;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkPersistenceService persistenceService;

    private final ArchivalRecordPersistenceService archivalRecordPersistenceService;

    private final UserPersistenceService userPersistenceService;

    private final ScanPersistenceService scanPersistenceService;

    /**
     * Upserts a bookmark, creating it if it doesn't exist or updating it if it does.
     *
     * @param bookmark The bookmark to upsert.
     * @return The upserted bookmark.
     * @throws AccessDeniedException           If the user is not authenticated or not authorized to perform the
     *                                         operation.
     * @throws ArchivalRecordNotFoundException If the associated archival record is not found.
     * @throws ScanNotFoundException           If the associated scan is not found.
     */
    @Transactional
    public Bookmark upsert(Bookmark bookmark)
            throws AccessDeniedException, ArchivalRecordNotFoundException, ScanNotFoundException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {

            var userOrNull = userPersistenceService.findByEmail(userFromCredentials.getEmail());
            if (userOrNull.isEmpty()) {
                throw new AccessDeniedException("User not found or not verified");
            }

            var userStored = userOrNull.get();

            var storedBookmark = persistenceService.tryFindByScanUrl(bookmark);

            var scan = scanPersistenceService.getById(bookmark.getScan().getUrl());

            storedBookmark.setUser(userStored);
            storedBookmark.setText(bookmark.getText());
            storedBookmark.setScan(scan);
            storedBookmark.setLastUpdated(LocalDateTime.now());

            var archivalRecord = archivalRecordPersistenceService.getArchivalRecordById(
                    bookmark.getArchivalRecord().getId());
            storedBookmark.setArchivalRecord(archivalRecord);

            if (storedBookmark.getId() != null) {
                archivalRecord.getBookmarks()
                        .removeIf(oldBookmark -> oldBookmark.getId().equals(storedBookmark.getId()));
            }

            archivalRecord.getBookmarks().add(storedBookmark);
            archivalRecordPersistenceService.persist(archivalRecord);
            return persistenceService.persist(storedBookmark);
        }

        throw new AccessDeniedException("User not authenticated");
    }

    /**
     * Deletes a bookmark by its ID.
     *
     * @param id The ID of the bookmark to be deleted.
     * @throws BookmarkNotFoundException If the bookmark with the given ID is not found.
     */
    @Transactional
    public void delete(Long id) throws BookmarkNotFoundException {
        log.debug("delete bookmark: {}", id);
        if (id != null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {

                var userOrNull = userPersistenceService.findByEmail(userFromCredentials.getEmail());
                if (userOrNull.isEmpty()) {
                    throw new AccessDeniedException("User not found or not verified");
                }
                var userStored = userOrNull.get();
                var storedBookmark = persistenceService.getBookmarkById(id);

                if (!Objects.equals(userStored.getId(), storedBookmark.getUser().getId())) {
                    throw new AccessDeniedException("User not permission for delete bookmark");
                }

                persistenceService.delete(id);
            } else {
                throw new AccessDeniedException("User not authenticated");
            }
        }
    }

}
