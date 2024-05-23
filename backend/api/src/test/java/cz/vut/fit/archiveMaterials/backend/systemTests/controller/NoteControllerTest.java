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
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.NotePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.NoteDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.service.EmailService;
import cz.vut.fit.archiveMaterials.backend.api.service.UserService;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import cz.vut.fit.archiveMaterials.backend.utils.TestUtils;
import java.util.List;
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
public class NoteControllerTest {

    private static final String NOTES_AR_ID = "/api/notes/{archivalRecordId}";
    private static final String NOTES_ID = "/api/notes/{id}";
    private static final String NOTES = "/api/notes";

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
    private UserService service;
    @Autowired
    private NotePersistenceService notePersistenceService;
    @Autowired
    private ArchivalRecordPersistenceService archivalRecordPersistenceService;


    @Test
    public void shouldGetAllNotesForArchivalRecord() throws Exception {

        var archivalRecord = TestData.createArchivalRecord();
        var foundArchivalRecord = archivalRecordPersistenceService.persist(archivalRecord);

        MvcResult mvcResult = mockMvc.perform(get(NOTES_AR_ID, foundArchivalRecord.getId()))
                .andExpect(status().isOk())
                .andReturn();
        List<NoteDetailDto> responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(responseDto.size(), foundArchivalRecord.getNotes().size());
    }

    @Test
    public void shouldUpsertNote() throws Exception {

        var archivalRecord = TestData.createArchivalRecord();
        archivalRecord.setScans(TestData.scans());
        archivalRecordPersistenceService.persist(archivalRecord);

        var user = TestData.createUser();
        service.registerUser(user);

        var login = TestData.authUser();
        var loginUser = service.loginUser(login);

        var createNote = TestData.noteCreateDto();

        MvcResult mvcResult = mockMvc.perform(put(NOTES)
                        .header("Authorization", "Bearer " + loginUser.getAccessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.json(createNote))
                )
                .andExpect(status().isOk())
                .andReturn();

        NoteDetailDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(responseDto.getText(), createNote.getText());
        assertEquals(responseDto.getArchivalRecordId(), createNote.getArchivalRecordId());
        assertEquals(responseDto.getScanUrl(), createNote.getScanUrl());
    }

    @Test
    public void shouldUpsertNote_NonAuthorizeUser() throws Exception {

        var createNote = TestData.noteCreateDto();

        MvcResult mvcResult = mockMvc.perform(put(NOTES)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.json(createNote))
                )
                .andExpect(status().isUnauthorized())
                .andReturn();
    }

    @Test
    public void shouldDeleteNote() throws Exception {

        var archivalRecord = TestData.createArchivalRecord();
        archivalRecord.setScans(TestData.scans());
        archivalRecordPersistenceService.persist(archivalRecord);

        var user = TestData.createUser();
        service.registerUser(user);

        var login = TestData.authUser();
        var loginUser = service.loginUser(login);

        var note = TestData.createNote();
        notePersistenceService.persistNote(note);

        mockMvc.perform(delete(NOTES_ID, note.getId())
                        .header("Authorization", "Bearer " + loginUser.getAccessToken()))
                .andExpect(status().isOk())
                .andReturn();

    }

    @Test
    public void shouldDeleteNote_NonAuthorizeUser() throws Exception {

        var note = TestData.createNote();

        mockMvc.perform(delete(NOTES_ID, note.getId()))
                .andExpect(status().isUnauthorized())
                .andReturn();
    }
}
