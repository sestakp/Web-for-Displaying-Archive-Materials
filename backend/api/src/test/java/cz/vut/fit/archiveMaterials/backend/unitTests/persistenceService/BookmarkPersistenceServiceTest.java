package cz.vut.fit.archiveMaterials.backend.unitTests.persistenceService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Bookmark;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.BookmarkPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.BookmarkRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.BookmarkNotFoundException;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class BookmarkPersistenceServiceTest {

    @Mock
    private BookmarkRepository bookmarkRepository;

    @InjectMocks
    private BookmarkPersistenceService bookmarkPersistenceService;

    @Test
    public void shouldPersistBookmark() {
        Bookmark bookmark = TestData.createBookmark();
        when(bookmarkRepository.save(any(Bookmark.class))).thenReturn(bookmark);

        Bookmark created = bookmarkPersistenceService.persist(bookmark);

        assertNotNull(created);
        assertEquals(bookmark, created);
        verify(bookmarkRepository, times(1))
                .save(any(Bookmark.class));
        verifyNoMoreInteractions(bookmarkRepository);
    }

    @Test
    public void shouldTryFindByScanUrlAndUserId() {
        Bookmark bookmark = TestData.createBookmark();
        long userId = 1L;
        when(bookmarkRepository.findByScanUrl(anyString())).thenReturn(Optional.empty());

        Bookmark result = bookmarkPersistenceService.tryFindByScanUrl(bookmark);

        assertNotNull(result);
        assertEquals(bookmark, result);
        verify(bookmarkRepository, times(1)).findByScanUrl(anyString());
        verifyNoMoreInteractions(bookmarkRepository);
    }

    @Test
    public void shouldGetBookmarkById() throws BookmarkNotFoundException {
        long id = 1L;
        Bookmark bookmark = TestData.createBookmark();
        when(bookmarkRepository.findById(id)).thenReturn(Optional.of(bookmark));

        Bookmark found = bookmarkPersistenceService.getBookmarkById(id);

        assertNotNull(found);
        assertEquals(bookmark, found);
        verify(bookmarkRepository, times(1)).findById(id);
        verifyNoMoreInteractions(bookmarkRepository);
    }

    @Test
    public void shouldThrowExceptionWhenGettingBookmarkByIdNotFound() {
        long id = 1L;
        when(bookmarkRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(BookmarkNotFoundException.class, () -> bookmarkPersistenceService.getBookmarkById(id));

        verify(bookmarkRepository, times(1)).findById(id);
        verifyNoMoreInteractions(bookmarkRepository);
    }

    @Test
    public void shouldDeleteBookmark() {
        long id = 1L;

        bookmarkPersistenceService.delete(id);

        verify(bookmarkRepository, times(1)).deleteById(id);
        verifyNoMoreInteractions(bookmarkRepository);
    }
}
