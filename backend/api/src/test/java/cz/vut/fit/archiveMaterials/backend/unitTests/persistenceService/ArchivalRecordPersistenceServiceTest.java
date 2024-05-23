package cz.vut.fit.archiveMaterials.backend.unitTests.persistenceService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.domain.dto.ScansResult;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ArchivalRecordRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.LanguageRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.LocationRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ScanRepository;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@ExtendWith(MockitoExtension.class)
public class ArchivalRecordPersistenceServiceTest {

    @Mock
    private ArchivalRecordRepository archivalRecordRepository;
    @Mock
    private ScanRepository scanRepository;
    @Mock
    private LocationRepository locationRepository;
    @Mock
    private LanguageRepository languageRepository;

    @InjectMocks
    private ArchivalRecordPersistenceService archivalRecordPersistenceService;

    @Test
    public void shouldPersistArchivalRecord() {
        ArchivalRecord archivalRecord = TestData.createArchivalRecord();
        when(archivalRecordRepository.save(any(ArchivalRecord.class))).thenReturn(archivalRecord);

        ArchivalRecord created = archivalRecordPersistenceService.persist(archivalRecord);

        assertNotNull(created);
        assertEquals(archivalRecord, created);
        verify(archivalRecordRepository, times(1))
                .save(any(ArchivalRecord.class));
        verifyNoMoreInteractions(archivalRecordRepository);
    }


    @Test
    public void shouldDeleteArchivalRecordById() throws ArchivalRecordNotFoundException {

        Long id = 1L;

        archivalRecordPersistenceService.delete(id);

        verify(archivalRecordRepository, times(1)).deleteById(id);
    }

    @Test
    public void shouldTryFindByLink() {

        ArchivalRecord currentRecord = TestData.createArchivalRecord();
        currentRecord.setLink("sample_link");
        ArchivalRecord expectedRecord = TestData.createArchivalRecord();
        when(archivalRecordRepository.findByLink("sample_link")).thenReturn(Optional.of(expectedRecord));

        ArchivalRecord foundRecord = archivalRecordPersistenceService.tryFindByLink(currentRecord);

        assertNotNull(foundRecord);
        assertEquals(expectedRecord, foundRecord);
        verify(archivalRecordRepository, times(1)).findByLink("sample_link");
    }

    @Test
    public void shouldGetAllScansByArchivalRecord() {

        List<Scan> mockScans = Arrays.asList(TestData.createScan(), TestData.createScan());

        Long archivalRecordId = 1L;

        when(scanRepository.findAllByArchivalRecordId(archivalRecordId)).thenReturn(mockScans);

        ScansResult result = archivalRecordPersistenceService.getAllScansByArchivalRecord(archivalRecordId);

        verify(scanRepository).findAllByArchivalRecordId(archivalRecordId);
        assertNotNull(result);
        assertEquals(mockScans, result.getScans());
    }

    @Test
    public void shouldReturnEmptyScansResultForNullArchivalRecordId() {

        ScansResult result = archivalRecordPersistenceService.getAllScansByArchivalRecord(null);

        verify(scanRepository, never()).findAllByArchivalRecordId(anyLong());

        assertNotNull(result);
        assertTrue(result.getScans().isEmpty());
        assertEquals(result.getScans().size(), 0);
    }

}
