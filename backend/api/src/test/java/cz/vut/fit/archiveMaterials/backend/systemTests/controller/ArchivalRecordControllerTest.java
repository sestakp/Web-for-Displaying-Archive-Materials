package cz.vut.fit.archiveMaterials.backend.systemTests.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.vut.fit.archiveMaterials.backend.ArchiveMaterialsBackendApplication;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordScansDto;
import cz.vut.fit.archiveMaterials.backend.api.service.EmailService;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import cz.vut.fit.archiveMaterials.backend.utils.TestUtils;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.shaded.org.awaitility.Awaitility;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.MOCK,
        classes = ArchiveMaterialsBackendApplication.class)
@ComponentScan(basePackages = {"cz.vut.fit.archiveMaterials.backend.api.controller.mapper"})
@Testcontainers
@AutoConfigureMockMvc
@TestPropertySource(
        locations = "classpath:application-test.properties")
public class ArchivalRecordControllerTest {

    private static final String ARCHIVAL_RECORD = "/api/archival-records";
    private static final String ARCHIVAL_RECORD_ID = "/api/archival-records/{id}";
    private static final String ARCHIVAL_RECORD_SCANS = "/api/archival-records/{id}/scans";

    @DynamicPropertySource
    static void setupProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mariadbContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mariadbContainer::getUsername);
        registry.add("spring.datasource.password", mariadbContainer::getPassword);

        registry.add("spring.elasticsearch.uris", elasticsearchContainer::getHttpHostAddress);
        registry.add("spring.jpa.properties.hibernate.search.backend.uris", elasticsearchContainer::getHttpHostAddress);
        Awaitility.await().atMost(60, TimeUnit.SECONDS).until(elasticsearchContainer::isRunning);

    }

    @Container
    private static final MariaDBContainer<?> mariadbContainer = new MariaDBContainer<>("mariadb:latest")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @Container
    private static final ElasticsearchContainer elasticsearchContainer = new ElasticsearchContainer(
            DockerImageName.parse("docker.elastic.co/elasticsearch/elasticsearch:8.11.1"))
            .withEnv("discovery.type", "single-node")
            .withEnv("xpack.security.enabled", "false");

    @Mock
    private static EmailService emailService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    private ArchivalRecordPersistenceService archivalRecordPersistenceService;


    @Test
    public void shouldGetArchivalRecordById() throws Exception {

        var archivalRecord = TestData.createArchivalRecord();
        archivalRecord.setLink("Example link");
        var foundArchivalRecord = archivalRecordPersistenceService.persist(archivalRecord);

        MvcResult mvcResult = mockMvc.perform(get(ARCHIVAL_RECORD_ID, foundArchivalRecord.getId()))
                .andExpect(status().isOk())
                .andReturn();
        ArchivalRecordDetailDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(foundArchivalRecord.getId(), responseDto.getId());
        assertEquals(foundArchivalRecord.getTypeOfRecord(), responseDto.getTypeOfRecord());
        assertEquals(foundArchivalRecord.getInventoryNumber(), responseDto.getInventoryNumber());
        assertEquals(foundArchivalRecord.getSignature(), responseDto.getSignature());
        assertEquals(foundArchivalRecord.getNumberOfScans(), responseDto.getNumberOfScans());
    }

    @Test
    public void shouldDeleteArchivalRecord() throws Exception {

        var archivalRecord = TestData.createArchivalRecord();

        mockMvc.perform(delete(ARCHIVAL_RECORD_ID, archivalRecord.getId()))
                .andExpect(status().isOk())
                .andReturn();
    }


    @Test
    public void shouldUpsertArchivalRecord() throws Exception {

        var createArchivalRecord = TestData.createArchivalRecordDto();

        MvcResult mvcResult = mockMvc.perform(put(ARCHIVAL_RECORD)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.json(createArchivalRecord))
                )
                .andExpect(status().isOk())
                .andReturn();

        ArchivalRecordDetailDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(createArchivalRecord.getTypeOfRecord(), responseDto.getTypeOfRecord());
        assertEquals(createArchivalRecord.getInventoryNumber(), responseDto.getInventoryNumber());
        assertEquals(createArchivalRecord.getSignature(), responseDto.getSignature());
        assertEquals(createArchivalRecord.getLink(), responseDto.getLink());
        assertEquals(createArchivalRecord.getDescription(), responseDto.getDescription());
        assertEquals(createArchivalRecord.getOtherNote(), responseDto.getOtherNote());
    }

    @Test
    public void shouldGetAllScansByArchivalRecord() throws Exception {

        var archivalRecord = TestData.createArchivalRecord();
        archivalRecordPersistenceService.persist(archivalRecord);

        MvcResult mvcResult = mockMvc.perform(get(ARCHIVAL_RECORD_SCANS, archivalRecord.getId()))
                .andExpect(status().isOk())
                .andReturn();
        ArchivalRecordScansDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(responseDto.getScans().size(), archivalRecord.getScans().size());
    }
}
