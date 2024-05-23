package cz.vut.fit.archiveMaterials.backend.unitTests.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.mapper.ArchiveMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchiveNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.service.ArchiveService;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ArchiveServiceTest {

    @Mock
    private ArchivePersistenceService archivePersistenceService;
    @Mock
    private ArchiveMapper archiveMapper;

    @InjectMocks
    private ArchiveService archiveService;

    @Test
    public void shouldCreateArchive() {

        Archive archive = TestData.createArchive();
        when(archivePersistenceService.persist(archive)).thenReturn(archive);

        Archive createdArchive = archiveService.create(archive);

        assertNotNull(createdArchive);
        verify(archivePersistenceService, times(1)).persist(archive);
        assertNotNull(createdArchive.getLastUpdated());
        verifyNoMoreInteractions(archivePersistenceService);
    }

    @Test
    public void shouldUpdateArchive() throws ArchiveNotFoundException {

        Long id = 1L;
        Archive existingArchive = TestData.createArchive();
        Archive updatedArchive = TestData.createArchive();
        updatedArchive.setName("Updated Name");
        when(archivePersistenceService.getArchiveById(id)).thenReturn(existingArchive);
        when(archivePersistenceService.persist(existingArchive)).thenReturn(updatedArchive);

        Archive updated = archiveService.update(id, updatedArchive);

        assertNotNull(updated);
        assertEquals(updatedArchive.getName(), updated.getName());
        verify(archivePersistenceService, times(1)).getArchiveById(id);
        verify(archiveMapper, times(1)).update(updatedArchive, existingArchive);
        verify(archivePersistenceService, times(1)).persist(existingArchive);
        verifyNoMoreInteractions(archivePersistenceService, archiveMapper);
    }

    @Test
    public void shouldDeleteArchive() {

        Long id = 1L;

        archiveService.delete(id);

        verify(archivePersistenceService, times(1)).delete(id);
        verifyNoMoreInteractions(archivePersistenceService);
    }

}
