package cz.vut.fit.archiveMaterials.backend.unitTests.persistenceService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ScanPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ScanRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.ScanNotFoundException;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ScanPersistenceServiceTest {

    @Mock
    private ScanRepository scanRepository;

    @InjectMocks
    private ScanPersistenceService scanPersistenceService;


    @Test
    public void shouldGetScanById() throws ScanNotFoundException {
        String scanId = "someScanId";
        Scan scan = TestData.createScan();
        when(scanRepository.findById(scanId)).thenReturn(Optional.of(scan));

        Scan foundScan = scanPersistenceService.getById(scanId);

        assertNotNull(foundScan);
        assertEquals(scan, foundScan);
        verify(scanRepository, times(1)).findById(scanId);
        verifyNoMoreInteractions(scanRepository);
    }

    @Test
    public void shouldThrowExceptionWhenScanNotFound() {
        String scanId = "nonExistingScanId";
        when(scanRepository.findById(scanId)).thenReturn(Optional.empty());

        assertThrows(ScanNotFoundException.class, () -> scanPersistenceService.getById(scanId));

        verify(scanRepository, times(1)).findById(scanId);
        verifyNoMoreInteractions(scanRepository);
    }

}
