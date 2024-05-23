package cz.vut.fit.archiveMaterials.backend.unitTests.persistenceService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ArchiveRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchiveNotFoundException;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

@ExtendWith(MockitoExtension.class)
public class ArchivePersistenceServiceTest {

    @Mock
    private ArchiveRepository archiveRepository;

    @InjectMocks
    private ArchivePersistenceService archivePersistenceService;

    @Test
    public void shouldPersistArchive() {
        Archive archive = TestData.createArchive();
        when(archiveRepository.save(any(Archive.class))).thenReturn(archive);

        Archive created = archivePersistenceService.persist(archive);

        assertNotNull(created);
        assertEquals(archive, created);
        verify(archiveRepository, times(1))
                .save(any(Archive.class));
        verifyNoMoreInteractions(archiveRepository);
    }

    @Test
    public void shouldGetArchiveById() throws ArchiveNotFoundException {
        long id = 1L;
        Archive archive = TestData.createArchive();
        when(archiveRepository.findById(id)).thenReturn(Optional.of(archive));

        Archive found = archivePersistenceService.getArchiveById(id);

        assertNotNull(found);
        assertEquals(archive, found);
        verify(archiveRepository, times(1)).findById(id);
        verifyNoMoreInteractions(archiveRepository);
    }

    @Test
    public void shouldThrowExceptionWhenGettingArchiveByIdNotFound() {
        long id = 1L;
        when(archiveRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ArchiveNotFoundException.class, () -> archivePersistenceService.getArchiveById(id));

        verify(archiveRepository, times(1)).findById(id);
        verifyNoMoreInteractions(archiveRepository);
    }

    @Test
    public void shouldGetAllArchives() {
        Archive archive1 = TestData.createArchive();
        Archive archive2 = TestData.createArchive();
        when(archiveRepository.findAll(any(Sort.class))).thenReturn(Arrays.asList(archive1, archive2));

        List<Archive> archives = archivePersistenceService.getAllArchives();

        assertNotNull(archives);
        assertEquals(2, archives.size());
        assertTrue(archives.contains(archive1));
        assertTrue(archives.contains(archive2));
        verifyNoMoreInteractions(archiveRepository);
    }

    @Test
    public void shouldDeleteArchiveById() {
        long id = 1L;

        archivePersistenceService.delete(id);

        verify(archiveRepository, times(1)).deleteById(id);
        verifyNoMoreInteractions(archiveRepository);
    }

    @Test
    public void shouldFindByAbbreviation() throws ArchiveNotFoundException {
        String abbreviation = "ABC";
        Archive archive = TestData.createArchive();
        when(archiveRepository.findByAbbreviationIgnoreCase(abbreviation)).thenReturn(Optional.of(archive));

        Archive found = archivePersistenceService.findByAbbreviation(abbreviation);

        assertNotNull(found);
        assertEquals(archive, found);
        verify(archiveRepository, times(1)).findByAbbreviationIgnoreCase(abbreviation);
        verifyNoMoreInteractions(archiveRepository);
    }

    @Test
    public void shouldThrowExceptionWhenFindByAbbreviationNotFound() {
        String abbreviation = "XYZ";
        when(archiveRepository.findByAbbreviationIgnoreCase(abbreviation)).thenReturn(Optional.empty());

        assertThrows(ArchiveNotFoundException.class, () -> archivePersistenceService.findByAbbreviation(abbreviation));

        verify(archiveRepository, times(1)).findByAbbreviationIgnoreCase(abbreviation);
        verifyNoMoreInteractions(archiveRepository);
    }
}
