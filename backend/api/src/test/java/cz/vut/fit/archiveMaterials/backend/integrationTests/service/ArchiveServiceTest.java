package cz.vut.fit.archiveMaterials.backend.integrationTests.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import cz.vut.fit.archiveMaterials.backend.ArchiveMaterialsBackendApplication;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchiveNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.service.ArchiveService;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.elasticsearch.ElasticsearchContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.shaded.org.awaitility.Awaitility;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.MOCK,
        classes = ArchiveMaterialsBackendApplication.class)
@Testcontainers
@AutoConfigureMockMvc
@TestPropertySource(
        locations = "classpath:application-test.properties")
public class ArchiveServiceTest {

    @Autowired
    private ArchivePersistenceService archivePersistenceService;
    @Autowired
    private ArchiveService archiveService;

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


    @Test
    void shouldCreateArchive() throws ArchiveNotFoundException {

        var archive = TestData.createArchive();

        var created = archiveService.create(archive);

        var retrievedArchive = archivePersistenceService.getArchiveById(created.getId());
        assertNotNull(retrievedArchive);
        assertEquals(archive.getId(), retrievedArchive.getId());
        assertEquals(archive.getName(), retrievedArchive.getName());
        assertEquals(archive.getDescription(), retrievedArchive.getDescription());
        assertEquals(archive.getAddress(), retrievedArchive.getAddress());
        assertEquals(archive.getAbbreviation(), retrievedArchive.getAbbreviation());
    }

    @Test
    void shouldUpdateArchive() throws ArchiveNotFoundException {

        Archive archive = TestData.createArchive();
        archivePersistenceService.persist(archive);

        String newName = "Updated Name";
        String newDesc = "Updated Desc";
        String newAbbr = "Updated Abbr";
        archive.setName(newName);
        archive.setAbbreviation(newAbbr);
        archive.setDescription(newDesc);

        Archive updated = archiveService.update(archive.getId(), archive);

        assertNotNull(updated);
        assertEquals(updated.getId(), archive.getId());
        assertEquals(newName, updated.getName());
        assertEquals(newDesc, updated.getDescription());
        assertEquals(newAbbr, updated.getAbbreviation());
        assertEquals(updated.getAddress(), archive.getAddress());
    }

    @Test
    void shouldDeleteArchive() {

        Archive archive = TestData.createArchive();
        archivePersistenceService.persist(archive);

        assertNotNull(archive);

        archiveService.delete(archive.getId());

        assertThrows(ArchiveNotFoundException.class, () -> archivePersistenceService.getArchiveById(archive.getId()));
    }

}
