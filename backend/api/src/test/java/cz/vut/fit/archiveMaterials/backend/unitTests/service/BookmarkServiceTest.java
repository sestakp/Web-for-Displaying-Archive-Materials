package cz.vut.fit.archiveMaterials.backend.unitTests.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Bookmark;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.BookmarkPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ScanPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.BookmarkNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.ScanNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.service.BookmarkService;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
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
public class BookmarkServiceTest {

    @Mock
    private BookmarkPersistenceService persistenceService;

    @Mock
    private ArchivalRecordPersistenceService archivalRecordPersistenceService;

    @Mock
    private UserPersistenceService userPersistenceService;

    @Mock
    private ScanPersistenceService scanPersistenceService;

    @InjectMocks
    private BookmarkService bookmarkService;

    @Test
    public void shouldUpsertBookmark() throws ArchivalRecordNotFoundException, ScanNotFoundException {

        Bookmark bookmark = TestData.createBookmark();
        bookmark.setId(null);
        Authentication authentication = TestData.createAuthenticationWithUser();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = TestData.createUser();
        when(userPersistenceService.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(persistenceService.tryFindByScanUrl(bookmark)).thenReturn(bookmark);
        when(scanPersistenceService.getById(bookmark.getScan().getUrl())).thenReturn(bookmark.getScan());
        when(archivalRecordPersistenceService.getArchivalRecordById(bookmark.getArchivalRecord().getId())).thenReturn(
                bookmark.getArchivalRecord());
        when(persistenceService.persist(bookmark)).thenReturn(bookmark);

        Bookmark result = bookmarkService.upsert(bookmark);

        assertNotNull(result);
        assertEquals(user, result.getUser());
        assertEquals(bookmark.getText(), result.getText());
        assertEquals(bookmark.getScan(), result.getScan());
        assertNotNull(result.getLastUpdated());
        verify(persistenceService, times(1)).persist(bookmark);
        verify(archivalRecordPersistenceService, times(1)).persist(bookmark.getArchivalRecord());
    }

    @Test
    public void shouldDeleteBookmark() throws BookmarkNotFoundException {

        Bookmark bookmark = TestData.createBookmark();
        Long id = bookmark.getId();
        Authentication authentication = TestData.createAuthenticationWithUser();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = TestData.createUser();
        when(userPersistenceService.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(persistenceService.getBookmarkById(id)).thenReturn(bookmark);

        bookmarkService.delete(id);

        verify(persistenceService, times(1)).delete(id);
    }

    @Test
    public void shouldThrowAccessDeniedExceptionOnUpsertWhenUserNotFound() {
        Bookmark bookmark = TestData.createBookmark();
        bookmark.setId(null);
        Authentication authentication = TestData.createAuthenticationWithUser();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = TestData.createUser();
        when(userPersistenceService.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        assertThrows(AccessDeniedException.class, () -> bookmarkService.upsert(bookmark));

        verify(userPersistenceService, times(1)).findByEmail(user.getEmail());
        verifyNoInteractions(persistenceService, archivalRecordPersistenceService, scanPersistenceService);
    }

    @Test
    public void shouldThrowBookmarkNotFoundExceptionOnDeleteWhenBookmarkNotFound() throws BookmarkNotFoundException {
        Long id = 1L;
        Authentication authentication = TestData.createAuthenticationWithUser();
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = TestData.createUser();
        when(userPersistenceService.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(persistenceService.getBookmarkById(id)).thenThrow(new BookmarkNotFoundException("Bookmark not found"));

        assertThrows(BookmarkNotFoundException.class, () -> bookmarkService.delete(id));

        verify(userPersistenceService, times(1)).findByEmail(user.getEmail());
        verify(persistenceService, times(1)).getBookmarkById(id);
        verifyNoMoreInteractions(persistenceService);
    }

}
