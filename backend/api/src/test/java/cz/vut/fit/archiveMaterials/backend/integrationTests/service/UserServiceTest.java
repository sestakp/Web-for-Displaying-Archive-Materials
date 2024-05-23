package cz.vut.fit.archiveMaterials.backend.integrationTests.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import cz.vut.fit.archiveMaterials.backend.ArchiveMaterialsBackendApplication;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.exception.UserNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.service.UserService;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
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
public class UserServiceTest {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserPersistenceService userPersistenceService;
    @Autowired
    private UserService userService;

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
    void shouldRegisterUser() throws UserNotFoundException {

        var user = TestData.createUser();

        var registerUser = userService.registerUser(user);

        var retrievedUser = userPersistenceService.getById(registerUser.getId());
        assertNotNull(retrievedUser);
        assertEquals(user.getId(), retrievedUser.getId());
        assertEquals(user.getName(), retrievedUser.getName());
        assertEquals(user.getEmail(), retrievedUser.getEmail());
        assertEquals(user.getUsername(), retrievedUser.getUsername());
    }

    @Test
    void shouldVerifyHash() throws Exception {

        var user = TestData.createUser();
        userPersistenceService.persist(user);

        String verifyHash = userService.verifyHash(user.getVerifyHash());

        assertNotNull(verifyHash);
        assertEquals(verifyHash, "Účet úspěšně ověřen");
    }

    @Test
    void shouldNotVerifyHash() throws Exception {

        var user = TestData.createUser();
        userPersistenceService.persist(user);
        String randomVerifyHash = "asdsdfagfsdfc";

        String verifyHash = userService.verifyHash(randomVerifyHash);

        assertNotNull(verifyHash);
        assertEquals(verifyHash, "Uživatelský účet nenalezen");
    }

    @Test
    public void shouldPasswordReset() throws Exception {

        var user = TestData.createUser();
        userPersistenceService.persist(user);

        var resetPass = TestData.passwordResetDto();
        resetPass.setHash(user.getPasswordResetHash());

        assertNotNull(user.getPasswordResetHash());
        userService.PasswordReset(resetPass);

    }

    @Test
    void shouldLoginUser() throws Exception {

        var user = TestData.createUser();
        userService.registerUser(user);

        var authUser = TestData.authUser();

        var loginUser = userService.loginUser(authUser);

        assertNotNull(loginUser);
        assertEquals(loginUser.getEmail(), authUser.getEmail());
    }

}
