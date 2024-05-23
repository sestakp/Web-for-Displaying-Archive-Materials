package cz.vut.fit.archiveMaterials.backend.systemTests.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import cz.vut.fit.archiveMaterials.backend.ArchiveMaterialsBackendApplication;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.AuthResponseDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.RegisterResponseDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.UserDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.service.EmailService;
import cz.vut.fit.archiveMaterials.backend.api.service.UserService;
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
public class UserControllerTest {

    private static final String USER_REGISTER = "/api/users/register";
    private static final String USER_LOGIN = "/api/users/login";
    private static final String USER_MAIL = "/api/users/{email}";
    private static final String RESET_PASS = "/api/users/password-reset";
    private static final String USER_VERIFICATION = "/api/users/verification/{verifyHash}";
    private static final String USER_FAVORITE = "/api/users/favourite/{id}";

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
    private UserPersistenceService persistenceService;

    @Autowired
    private UserService service;

    @Autowired
    private ArchivalRecordPersistenceService archivalRecordPersistenceService;

    @Test
    public void shouldRegisterUser() throws Exception {

        var registerUser = TestData.registerDto();

        MvcResult mvcResult = mockMvc.perform(post(USER_REGISTER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.json(registerUser))
                )
                .andExpect(status().isOk())
                .andReturn();

        RegisterResponseDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(responseDto.getName(), registerUser.getName());
        assertEquals(responseDto.getEmail(), registerUser.getEmail());
    }

    @Test
    public void shouldGetUserByEmail() throws Exception {

        var user = TestData.createUser();
        persistenceService.persist(user);

        MvcResult mvcResult = mockMvc.perform(get(USER_MAIL, user.getEmail()))
                .andExpect(status().isOk())
                .andReturn();

        UserDetailDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(responseDto.getName(), user.getName());
        assertEquals(responseDto.getEmail(), user.getEmail());
    }

    @Test
    public void shouldVerifyUser() throws Exception {

        var user = TestData.createUser();
        persistenceService.persist(user);

        MvcResult mvcResult = mockMvc.perform(get(USER_VERIFICATION, user.getVerifyHash()))
                .andExpect(status().isOk())
                .andReturn();

        String responseDto = mvcResult.getResponse().getContentAsString();

        assertNotNull(responseDto);
    }

    @Test
    public void shouldPasswordReset() throws Exception {

        var user = TestData.createUser();
        persistenceService.persist(user);
        var resetPass = TestData.passwordResetDto();
        resetPass.setHash(user.getPasswordResetHash());

        MvcResult mvcResult = mockMvc.perform(put(RESET_PASS)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.json(resetPass))
                )
                .andExpect(status().isOk())
                .andReturn();

    }

    @Test
    public void shouldLoginUser() throws Exception {

        var user = TestData.createUser();
        service.registerUser(user);

        var loginUser = TestData.loginRequestDto();

        MvcResult mvcResult = mockMvc.perform(post(USER_LOGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.json(loginUser))
                )
                .andExpect(status().isOk())
                .andReturn();

        AuthResponseDto responseDto = objectMapper
                .readValue(mvcResult.getResponse().getContentAsString(), new TypeReference<>() {
                });

        assertNotNull(responseDto);
        assertEquals(responseDto.getEmail(), loginUser.getEmail());
    }

    @Test
    public void shouldAddToFavouritesRecord() throws Exception {

        var archivalRecord = TestData.createArchivalRecord();
        archivalRecordPersistenceService.persist(archivalRecord);

        var user = TestData.createUser();
        service.registerUser(user);

        var login = TestData.authUser();
        var loginUser = service.loginUser(login);

        MvcResult mvcResult = mockMvc.perform(post(USER_FAVORITE, archivalRecord.getId())
                        .header("Authorization", "Bearer " + loginUser.getAccessToken()))
                .andExpect(status().isOk())
                .andReturn();

        var user1 = persistenceService.getById(user.getId());

        assertEquals(user1.getFavouriteArchivalRecords().size(), 1);
        assertEquals(user1.getFavouriteArchivalRecords().stream().findFirst().get().getId(), archivalRecord.getId());
    }
}
