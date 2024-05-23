package cz.vut.fit.archiveMaterials.backend.unitTests.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Note;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.NotePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ScanPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.NoteNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.ScanNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.service.NoteService;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import java.util.Collection;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
public class NoteServiceTest {

    @Mock
    private NotePersistenceService persistenceService;

    @Mock
    private ArchivalRecordPersistenceService archivalRecordPersistenceService;

    @Mock
    private UserPersistenceService userPersistenceService;

    @Mock
    private ScanPersistenceService scanPersistenceService;

    @InjectMocks
    private NoteService noteService;


    @Test
    public void shouldDeleteNote() throws NoteNotFoundException {
        Note note = TestData.createNote();
        Long id = note.getId();
        Authentication authentication = TestData.createAuthenticationWithUser();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = TestData.createUser();
        when(userPersistenceService.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(persistenceService.getNoteById(id)).thenReturn(note);

        noteService.delete(id);

        verify(persistenceService, times(1)).delete(id);
    }

    @Test
    public void shouldGetAllNotesByArchivalRecord() throws AccessDeniedException {
        Long archivalRecordId = 1L;
        Authentication authentication = TestData.createAuthenticationWithUser();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = TestData.createUser();
        when(userPersistenceService.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(persistenceService.findByArchivalRecordIdAndAccessibilityOrUserId(archivalRecordId,
                user.getId())).thenReturn(
                TestData.createListOfNotes());

        Collection<Note> result = noteService.getAllScansByArchivalRecord(archivalRecordId);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(persistenceService, times(1)).findByArchivalRecordIdAndAccessibilityOrUserId(archivalRecordId,
                user.getId());
    }

    @Test
    public void shouldThrowAccessDeniedExceptionOnUpsertWhenUserNotFound() {
        Note note = TestData.createNote();
        Authentication authentication = TestData.createAuthenticationWithUser();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = TestData.createUser();
        when(userPersistenceService.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        assertThrows(AccessDeniedException.class, () -> noteService.upsert(note));

        verify(userPersistenceService, times(1)).findByEmail(user.getEmail());
        verifyNoInteractions(persistenceService, archivalRecordPersistenceService, scanPersistenceService);
    }

    @Test
    public void shouldThrowNoteNotFoundExceptionOnDeleteWhenNoteNotFound() throws NoteNotFoundException {
        Long id = 1L;
        Authentication authentication = TestData.createAuthenticationWithUser();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = TestData.createUser();
        when(userPersistenceService.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(persistenceService.getNoteById(id)).thenThrow(new NoteNotFoundException("Note not found"));

        assertThrows(NoteNotFoundException.class, () -> noteService.delete(id));

        verify(userPersistenceService, times(1)).findByEmail(user.getEmail());
        verify(persistenceService, times(1)).getNoteById(id);
        verifyNoMoreInteractions(persistenceService);
    }

}
