package cz.vut.fit.archiveMaterials.backend.systemTests.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.vut.fit.archiveMaterials.backend.ArchiveMaterialsBackendApplication;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive_;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchiveDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchiveDto;
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
import org.springframework.test.web.servlet.ResultActions;
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
public class ArchiveControllerTest {

    private static final String ARCHIVES = "/api/archives";
    private static final String ARCHIVES_ID = "/api/archives/{id}";
    private static final String ARCHIVES_DETAIL = "/api/archives/{id}/detail";
    private static final String ARCHIVES_ABBREVIATION = "/api/archives/getByAbbreviation/{name}";

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
    private ArchivePersistenceService archivePersistenceService;


    @Test
    public void shouldGetArchiveByIdDetail() throws Exception {

        Archive archive = TestData.createArchive();
        var returnedArchive = archivePersistenceService.persist(archive);

        ResultActions result = mockMvc.perform(
                get(ARCHIVES_DETAIL, returnedArchive.getId()).contentType(MediaType.APPLICATION_JSON));

        result.andExpect(status().isOk())
                .andExpect(content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath(Archive_.ID).value(archive.getId()))
                .andExpect(jsonPath(Archive_.DESCRIPTION).value(archive.getDescription()))
                .andExpect(jsonPath(Archive_.NAME).value(archive.getName()));
    }

    @Test
    public void shouldGetArchiveByIdDetail1() throws Exception {

        var archive = TestData.createArchive();
        var foundArchive = archivePersistenceService.persist(archive);

        MvcResult mvcResult = mockMvc.perform(get(ARCHIVES_DETAIL, foundArchive.getId()))
                .andExpect(status().isOk())
                .andReturn();
        ArchiveDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });
        assertNotNull(responseDto);
        assertEquals(foundArchive.getId(), responseDto.getId());
        assertEquals(foundArchive.getName(), responseDto.getName());
        assertEquals(foundArchive.getDescription(), responseDto.getDescription());
        assertEquals(foundArchive.getAddress(), responseDto.getAddress());
        assertEquals(foundArchive.getAbbreviation(), responseDto.getAbbreviation());

    }

    @Test
    public void shouldGetArchiveById() throws Exception {

        var archive = TestData.createArchive();
        var foundArchive = archivePersistenceService.persist(archive);

        MvcResult mvcResult = mockMvc.perform(get(ARCHIVES_ID, foundArchive.getId()))
                .andExpect(status().isOk())
                .andReturn();
        ArchiveDetailDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(foundArchive.getId(), responseDto.getId());
        assertEquals(foundArchive.getName(), responseDto.getName());
        assertEquals(foundArchive.getDescription(), responseDto.getDescription());
        assertEquals(foundArchive.getAddress(), responseDto.getAddress());
        assertEquals(foundArchive.getAbbreviation(), responseDto.getAbbreviation());
    }


    @Test
    public void shouldGetArchiveByAbbreviationName() throws Exception {

        var archive = TestData.createArchive();
        var foundArchive = archivePersistenceService.persist(archive);

        MvcResult mvcResult = mockMvc.perform(get(ARCHIVES_ABBREVIATION, foundArchive.getAbbreviation()))
                .andExpect(status().isOk())
                .andReturn();
        ArchiveDetailDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(foundArchive.getId(), responseDto.getId());
        assertEquals(foundArchive.getName(), responseDto.getName());
        assertEquals(foundArchive.getDescription(), responseDto.getDescription());
        assertEquals(foundArchive.getAddress(), responseDto.getAddress());
        assertEquals(foundArchive.getAbbreviation(), responseDto.getAbbreviation());
    }
}
