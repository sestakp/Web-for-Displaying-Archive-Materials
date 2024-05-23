package cz.vut.fit.archiveMaterials.backend.api.service;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Note;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.NotePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ScanPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.NoteNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.ScanNotFoundException;
import java.time.LocalDateTime;
import java.util.Collection;
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
public class NoteService {


    private final NotePersistenceService persistenceService;

    private final ArchivalRecordPersistenceService archivalRecordPersistenceService;

    private final UserPersistenceService userPersistenceService;

    private final ScanPersistenceService scanPersistenceService;

    /**
     * Upserts a note, creating it if it doesn't exist or updating it if it does.
     *
     * @param note The note to upsert.
     * @return The upserted note.
     * @throws AccessDeniedException           If the user is not authenticated or not authorized to perform the
     *                                         operation.
     * @throws ArchivalRecordNotFoundException If the associated archival record is not found.
     * @throws ScanNotFoundException           If the associated scan is not found.
     */
    @Transactional
    public Note upsert(Note note) throws AccessDeniedException, ArchivalRecordNotFoundException, ScanNotFoundException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {

            var userOrNull = userPersistenceService.findByEmail(userFromCredentials.getEmail());
            if (userOrNull.isEmpty()) {
                throw new AccessDeniedException("User not found or not verified");
            }

            var userStored = userOrNull.get();

            var storedNote = persistenceService.tryFindByScanUrlAndUserId(note, userStored.getId());

            var archivalRecord = archivalRecordPersistenceService.getArchivalRecordById(
                    note.getArchivalRecord().getId());

            var scan = scanPersistenceService.getById(note.getScan().getUrl());

            storedNote.setUser(userStored);
            storedNote.setData(note.getData());
            storedNote.setText(note.getText());
            storedNote.setAccessibility(note.getAccessibility());
            storedNote.setArchivalRecord(archivalRecord);
            storedNote.setScan(scan);
            storedNote.setLastUpdated(LocalDateTime.now());

            if (storedNote.getId() != null) {
                archivalRecord.getNotes().removeIf(oldNote -> oldNote.getId().equals(storedNote.getId()));
            }
            archivalRecord.getNotes().add(storedNote);

            if (Objects.equals(storedNote.getData(), "") || storedNote.getData() == null) {
                return persistenceService.persistNote(storedNote);
            } else {
                return persistenceService.persist(storedNote);
            }
        }

        throw new AccessDeniedException("User not authenticated");
    }

    /**
     * Deletes a note by its ID.
     *
     * @param id The ID of the note to be deleted.
     * @throws NoteNotFoundException If the note with the given ID is not found.
     */
    @Transactional
    public void delete(Long id) throws NoteNotFoundException {
        log.debug("delete note: {}", id);
        if (id != null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {

                var userOrNull = userPersistenceService.findByEmail(userFromCredentials.getEmail());
                if (userOrNull.isEmpty()) {
                    throw new AccessDeniedException("User not found or not verified");
                }
                var userStored = userOrNull.get();
                var storedNote = persistenceService.getNoteById(id);

                if (!Objects.equals(userStored.getId(), storedNote.getUser().getId())) {
                    throw new AccessDeniedException("user not permission for delete note");
                }

                persistenceService.delete(id);
            } else {
                throw new AccessDeniedException("User not authenticated");
            }
        }
    }

    /**
     * Retrieves all notes associated with an archival record.
     *
     * @param archivalRecordId The ID of the archival record.
     * @return A collection of notes associated with the archival record.
     * @throws AccessDeniedException If the user is not authenticated or not authorized to perform the operation.
     */
    @Transactional
    public Collection<Note> getAllScansByArchivalRecord(Long archivalRecordId) throws AccessDeniedException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {

            var userOrNull = userPersistenceService.findByEmail(userFromCredentials.getEmail());
            if (userOrNull.isEmpty()) {
                throw new AccessDeniedException("User not found or not verified");
            }

            var userStored = userOrNull.get();

            return persistenceService.findByArchivalRecordIdAndAccessibilityOrUserId(archivalRecordId,
                    userStored.getId());
        } else {
            return persistenceService.findByArchivalRecordIdAndAccessibilityOrUserId(archivalRecordId, -1L);
        }
    }
}
