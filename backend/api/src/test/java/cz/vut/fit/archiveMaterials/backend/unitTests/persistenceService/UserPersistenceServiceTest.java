package cz.vut.fit.archiveMaterials.backend.unitTests.persistenceService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.UserRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.UserNotFoundException;
import cz.vut.fit.archiveMaterials.backend.utils.TestData;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UserPersistenceServiceTest {

    @Mock
    private UserRepository repository;

    @InjectMocks
    private UserPersistenceService persistenceService;

    @Test
    public void shouldPersistUser() {

        User user = TestData.createUser();
        when(repository.save(any(User.class))).thenReturn(user);

        User created = persistenceService.persist(user);

        assertNotNull(created);
        assertEquals(user, created);
        verify(repository, times(1))
                .save(any(User.class));
        verifyNoMoreInteractions(repository);
    }

    @Test
    public void shouldGetById() throws UserNotFoundException {

        User user = TestData.createUser();
        when(repository.findById(any(Long.class)))
                .thenReturn(Optional.of(user));

        User foundUser = persistenceService.getById(user.getId());

        assertNotNull(foundUser);
        assertEquals(user, foundUser);
        verify(repository, times(1))
                .findById(any(Long.class));
        verifyNoMoreInteractions(repository);
    }

    @Test
    public void shouldThrowExceptionWhenUserNotFound() {

        Long nonExistingUserId = 999L;

        when(repository.findById(any(Long.class)))
                .thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> persistenceService.getById(nonExistingUserId));
    }

    @Test
    public void shouldFindByEmail() {

        String email = "test@example.com";
        User user = TestData.createUser();
        when(repository.findByEmail(email)).thenReturn(Optional.of(user));

        Optional<User> foundUser = persistenceService.findByEmail(email);

        assertTrue(foundUser.isPresent());
        assertEquals(user, foundUser.get());
        verify(repository, times(1)).findByEmail(email);
        verifyNoMoreInteractions(repository);
    }

    @Test
    public void shouldFindByEmailAndIsVerified() {

        String email = "test@example.com";
        User user = TestData.createUser();
        when(repository.findByEmailAndIsVerified(email, true)).thenReturn(Optional.of(user));

        Optional<User> foundUser = persistenceService.findByEmailAndIsVerified(email);

        assertTrue(foundUser.isPresent());
        assertEquals(user, foundUser.get());
        verify(repository, times(1)).findByEmailAndIsVerified(email, true);
        verifyNoMoreInteractions(repository);
    }

    @Test
    public void shouldFindByVerifyHash() {

        String verifyHash = "hash123";
        User user = TestData.createUser();
        when(repository.findByVerifyHash(verifyHash)).thenReturn(Optional.of(user));

        Optional<User> foundUser = persistenceService.findByVerifyHash(verifyHash);

        assertTrue(foundUser.isPresent());
        assertEquals(user, foundUser.get());
        verify(repository, times(1)).findByVerifyHash(verifyHash);
        verifyNoMoreInteractions(repository);
    }

    @Test
    public void shouldFindByPasswordResetHash() throws UserNotFoundException {

        String resetHash = "reset123";
        User user = TestData.createUser();
        when(repository.findByPasswordResetHash(resetHash)).thenReturn(Optional.of(user));

        User foundUser = persistenceService.findByPasswordResetHash(resetHash);

        assertNotNull(foundUser);
        assertEquals(user, foundUser);
        verify(repository, times(1)).findByPasswordResetHash(resetHash);
        verifyNoMoreInteractions(repository);
    }

    @Test
    public void shouldThrowExceptionWhenUserNotFoundByEmail() {

        String email = "nonexistent@example.com";
        when(repository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> persistenceService.getUserByEmail(email));
    }

}
