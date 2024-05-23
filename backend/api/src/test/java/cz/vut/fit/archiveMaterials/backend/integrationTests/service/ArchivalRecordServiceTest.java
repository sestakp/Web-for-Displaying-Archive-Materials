package cz.vut.fit.archiveMaterials.backend.integrationTests.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import cz.vut.fit.archiveMaterials.backend.ArchiveMaterialsBackendApplication;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivePersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchiveNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.service.ArchivalRecordService;
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
public class ArchivalRecordServiceTest {

    @Autowired
    private ArchivalRecordService archivalRecordService;

    @Autowired
    private ArchivalRecordPersistenceService archivalRecordPersistenceService;

    @Autowired
    private ArchivePersistenceService archivePersistenceService;

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
    void testUpsertNewArchivalRecord() throws ArchiveNotFoundException, ArchivalRecordNotFoundException {

        Archive archive = TestData.createArchive();
        var persistedArchive = archivePersistenceService.persist(archive);

        ArchivalRecord archivalRecord = TestData.createArchivalRecord();
        archivalRecord.setArchive(persistedArchive);

        ArchivalRecord createdRecord = archivalRecordService.upsert(archivalRecord);

        ArchivalRecord retrievedRecord = archivalRecordPersistenceService.getArchivalRecordById(createdRecord.getId());
        assertEquals(archivalRecord.getId(), retrievedRecord.getId());
        assertEquals(archivalRecord.getTypeOfRecord(), retrievedRecord.getTypeOfRecord());
        assertEquals(archivalRecord.getLink(), retrievedRecord.getLink());
        assertEquals(archivalRecord.getSignature(), retrievedRecord.getSignature());
    }


    @Test
    void testUpsertCurrentArchivalRecord() throws ArchiveNotFoundException, ArchivalRecordNotFoundException {

        ArchivalRecord archivalRecord = TestData.createArchivalRecord();
        Archive archive = TestData.createArchive();
        var persistedArchive = archivePersistenceService.persist(archive);

        archivalRecord.setArchive(persistedArchive);
        archivalRecord.setLink("Example link381");
        archivalRecord = archivalRecordPersistenceService.persist(archivalRecord);

        var oldSignature = archivalRecord.getSignature();
        var updatedArchivalRecord = archivalRecord;

        updatedArchivalRecord.setSignature(archivalRecord.getSignature() + "_UPDATED");
        updatedArchivalRecord = archivalRecordService.upsert(updatedArchivalRecord);

        ArchivalRecord retrievedRecord = archivalRecordPersistenceService.getArchivalRecordById(
                updatedArchivalRecord.getId());
        assertEquals(archivalRecord.getId(), retrievedRecord.getId());
        assertEquals(archivalRecord.getTypeOfRecord(), retrievedRecord.getTypeOfRecord());
        assertEquals(archivalRecord.getLink(), retrievedRecord.getLink());
        assertEquals(oldSignature + "_UPDATED", retrievedRecord.getSignature());
    }

    @Test
    void testUpsertWithInvalidArchive() {

        ArchivalRecord archivalRecord = TestData.createArchivalRecord();
        Archive archive = new Archive();
        archive.setName("NotExist archive");
        archivalRecord.setArchive(archive);

        assertThrows(ArchiveNotFoundException.class, () -> {
            archivalRecordService.upsert(archivalRecord);
        });

    }

    @Test
    void shouldDeleteArchivalRecord() throws ArchivalRecordNotFoundException {

        var archivalRecord = TestData.createArchivalRecord();
        archivalRecord.setLink("Link example 186582299");
        archivalRecordPersistenceService.persist(archivalRecord);

        assertNotNull(archivalRecord);

        archivalRecordService.delete(archivalRecord.getId());

        assertThrows(ArchivalRecordNotFoundException.class,
                () -> archivalRecordPersistenceService.getArchivalRecordById(archivalRecord.getId()));
    }

}
