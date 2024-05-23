package cz.vut.fit.archiveMaterials.backend.unitTests.persistenceService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Note;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.NotePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.NoteRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.NoteNotFoundException;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class NotePersistenceServiceTest {

    @Mock
    private NoteRepository noteRepository;

    @InjectMocks
    private NotePersistenceService notePersistenceService;

    @Test
    public void shouldPersistNote() {
        Note note = TestData.createNote();
        when(noteRepository.save(any(Note.class))).thenReturn(note);

        Note created = notePersistenceService.persistNote(note);

        assertNotNull(created);
        assertEquals(note, created);
        verify(noteRepository, times(1))
                .save(any(Note.class));
        verifyNoMoreInteractions(noteRepository);
    }

    @Test
    public void shouldGetNotesForArchivalRecord() {
        long archivalRecordId = 1L;
        Note note1 = TestData.createNote();
        Note note2 = TestData.createNote();
        when(noteRepository.findAllByArchivalRecordId(archivalRecordId)).thenReturn(Arrays.asList(note1, note2));

        Collection<Note> notes = notePersistenceService.getNotesForArchivalRecord(archivalRecordId);

        assertNotNull(notes);
        assertEquals(2, notes.size());
        assertTrue(notes.contains(note1));
        assertTrue(notes.contains(note2));
        verify(noteRepository, times(1)).findAllByArchivalRecordId(archivalRecordId);
        verifyNoMoreInteractions(noteRepository);
    }

    @Test
    public void shouldFindByArchivalRecordIdAndAccessibilityOrUserId() {
        long archivalRecordId = 1L;
        long userId = 1L;
        Note note1 = TestData.createNote();
        Note note2 = TestData.createNote();
        when(noteRepository.findByArchivalRecordIdAndAccessibilityOrUserId(archivalRecordId, userId)).thenReturn(
                Arrays.asList(note1, note2));

        Collection<Note> notes = notePersistenceService.findByArchivalRecordIdAndAccessibilityOrUserId(archivalRecordId,
                userId);

        assertNotNull(notes);
        assertEquals(2, notes.size());
        assertTrue(notes.contains(note1));
        assertTrue(((Collection<?>) notes).contains(note2));
        verify(noteRepository, times(1)).findByArchivalRecordIdAndAccessibilityOrUserId(archivalRecordId, userId);
        verifyNoMoreInteractions(noteRepository);
    }

    @Test
    public void shouldTryFindByScanUrlAndUserId() {
        Note note = TestData.createNote();
        long userId = 1L;
        when(noteRepository.findByScanUrlAndUserIdAndAccessibility(anyString(), eq(userId), any())).thenReturn(
                Optional.empty());

        Note result = notePersistenceService.tryFindByScanUrlAndUserId(note, userId);

        assertNotNull(result);
        assertEquals(note, result);
        verify(noteRepository, times(1)).findByScanUrlAndUserIdAndAccessibility(anyString(), eq(userId), any());
        verifyNoMoreInteractions(noteRepository);
    }

    @Test
    public void shouldGetNoteById() throws NoteNotFoundException {
        long id = 1L;
        Note note = TestData.createNote();
        when(noteRepository.findById(id)).thenReturn(Optional.of(note));

        Note found = notePersistenceService.getNoteById(id);

        assertNotNull(found);
        assertEquals(note, found);
        verify(noteRepository, times(1)).findById(id);
        verifyNoMoreInteractions(noteRepository);
    }

    @Test
    public void shouldThrowExceptionWhenGetNoteByIdNotFound() {
        long id = 1L;
        when(noteRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(NoteNotFoundException.class, () -> notePersistenceService.getNoteById(id));

        verify(noteRepository, times(1)).findById(id);
        verifyNoMoreInteractions(noteRepository);
    }

    @Test
    public void shouldDeleteNoteById() {
        long id = 1L;

        notePersistenceService.delete(id);

        verify(noteRepository, times(1)).deleteById(id);
        verifyNoMoreInteractions(noteRepository);
    }

}
