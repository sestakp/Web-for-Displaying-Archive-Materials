package cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Note;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.NoteRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.NoteNotFoundException;
import cz.vut.fit.archiveMaterials.backend.core.utils.JsonParseUtil;
import java.util.Collection;
import java.util.Optional;
import javax.json.JsonObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service class for managing operations related to note persistence.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotePersistenceService {

    private final NoteRepository repository;

    /**
     * Persists a note entity.
     *
     * @param note The note entity to persist.
     * @return The persisted note entity.
     */
    public Note persist(Note note) {
        log.debug("persist: {}", note);
        JsonObject jsonObject = JsonParseUtil.parseJson(note.getData());

        var objects = jsonObject.getJsonArray("objects");
        if (!objects.isEmpty()) {

            return repository.save(note);
        }

        if (note.getId() != null) {
            repository.delete(note);
        }
        return note;
    }

    /**
     * Persists a note entity.
     *
     * @param note The note entity to persist.
     * @return The persisted note entity.
     */
    public Note persistNote(Note note) {
        log.debug("persistNote: {}", note);
        return repository.save(note);
    }

    /**
     * Retrieves all notes associated with a specific archival record.
     *
     * @param archivalRecordId The ID of the archival record.
     * @return A collection of notes associated with the archival record.
     */
    public Collection<Note> getNotesForArchivalRecord(Long archivalRecordId) {

        return repository.findAllByArchivalRecordId(archivalRecordId);
    }

    /**
     * Retrieves notes by archival record ID and either accessibility or user ID.
     *
     * @param archivalRecordId The ID of the archival record.
     * @param userId           The ID of the user.
     * @return A collection of notes.
     */
    public Collection<Note> findByArchivalRecordIdAndAccessibilityOrUserId(Long archivalRecordId, Long userId) {
        return repository.findByArchivalRecordIdAndAccessibilityOrUserId(archivalRecordId, userId);
    }

    /**
     * Tries to find a note by its scan URL and user ID.
     *
     * @param note   The note to find.
     * @param userId The ID of the user.
     * @return The found note, or the provided note if not found.
     */
    public Note tryFindByScanUrlAndUserId(Note note, Long userId) {
        log.debug("tryFindByScanUrlAndUserId {}", note.getScan().getUrl());
        var storedRecordOptional = repository.findByScanUrlAndUserIdAndAccessibility(note.getScan().getUrl(), userId,
                note.getAccessibility());

        if (storedRecordOptional.isPresent()) {
            return storedRecordOptional.get();
        }

        return note;
    }

    /**
     * Retrieves a note entity by its ID.
     *
     * @param id The ID of the note to retrieve.
     * @return The retrieved note entity.
     * @throws NoteNotFoundException If the note with the specified ID is not found.
     */
    public Note getNoteById(Long id) throws NoteNotFoundException {
        log.debug("getNoteById {}", id);
        if (id != null) {
            Optional<Note> found = repository.findById(id);
            if (found.isPresent()) {
                return found.get();
            }
        }
        throw new NoteNotFoundException("Note not found.");
    }

    /**
     * Deletes a note entity by its ID.
     *
     * @param id The ID of the note to delete.
     */
    public void delete(Long id) {
        log.debug("delete bookmark: {}", id);
        if (id != null) {
            repository.deleteById(id);
        }
    }
}
