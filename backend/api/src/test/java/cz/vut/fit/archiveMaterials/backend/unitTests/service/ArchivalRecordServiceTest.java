package cz.vut.fit.archiveMaterials.backend.unitTests.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.controller.mapper.ArchivalRecordDtoMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.elasticSearchRepository.ArchivalRecordElasticSearchRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.mapper.ArchivalRecordMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchiveNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.service.ArchivalRecordService;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ArchivalRecordServiceTest {

    @Mock
    private ArchivalRecordPersistenceService archivalRecordPersistenceService;

    @Mock
    private ArchivePersistenceService archivePersistenceService;

    @Mock
    private UserPersistenceService userPersistenceService;

    @Mock
    private ArchivalRecordMapper archivalRecordMapper;

    @Mock
    private ArchivalRecordDtoMapper archivalRecordDtoMapper;

    @Mock
    private ArchivalRecordElasticSearchRepository archivalRecordElasticSearchRepository;

    @InjectMocks
    private ArchivalRecordService archivalRecordService;


    @Test
    public void shouldUpsertArchivalRecord() throws ArchiveNotFoundException {
        ArchivalRecord archivalRecord = TestData.createArchivalRecord();
        when(archivalRecordPersistenceService.tryFindByLink(archivalRecord)).thenReturn(archivalRecord);
        when(archivalRecordPersistenceService.persist(archivalRecord)).thenReturn(archivalRecord);

        ArchivalRecord result = archivalRecordService.upsert(archivalRecord);

        assertNotNull(result);
        assertEquals(archivalRecord, result);
        verify(archivalRecordPersistenceService, times(1)).tryFindByLink(archivalRecord);
        verify(archivalRecordPersistenceService, times(1)).persist(archivalRecord);
    }

    @Test
    public void shouldDeleteArchivalRecord() throws ArchivalRecordNotFoundException {
        Long id = 1L;
        doNothing().when(archivalRecordPersistenceService).delete(id);

        archivalRecordService.delete(id);

        verify(archivalRecordPersistenceService, times(1)).delete(id);
    }


    @Test
    public void shouldGetArchivalRecordById() throws ArchivalRecordNotFoundException {
        Long id = 1L;
        ArchivalRecord archivalRecord = Mockito.mock(ArchivalRecord.class);
        ArchivalRecordDetailDto expectedDto = Mockito.mock(ArchivalRecordDetailDto.class);

        Mockito.when(archivalRecordPersistenceService.getArchivalRecordById(id)).thenReturn(archivalRecord);
        Mockito.when(archivalRecordDtoMapper.map(Mockito.any(ArchivalRecord.class))).thenReturn(expectedDto);

        ArchivalRecordDetailDto result = archivalRecordService.getArchivalRecordById(id);

        assertNotNull(result);
        assertEquals(expectedDto, result);
        assertEquals(expectedDto.getId(), result.getId());

        Mockito.verify(archivalRecordPersistenceService, times(1)).getArchivalRecordById(id);
        Mockito.verify(archivalRecordDtoMapper, times(1)).map(Mockito.any(ArchivalRecord.class));
    }


}
