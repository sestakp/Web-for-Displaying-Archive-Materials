package cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.UserRepository;
import cz.vut.fit.archiveMaterials.backend.api.exception.UserNotFoundException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service class for managing operations related to user persistence.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserPersistenceService {

    private final UserRepository userRepository;

    /**
     * Persists a user entity.
     *
     * @param user The user entity to persist.
     * @return The persisted user entity.
     */
    public User persist(User user) {
        log.debug("persist: {}", user);
        return userRepository.save(user);
    }

    /**
     * Retrieves a user entity by its ID.
     *
     * @param id The ID of the user to retrieve.
     * @return The retrieved user entity.
     * @throws UserNotFoundException If the user with the specified ID is not found.
     */
    public User getById(Long id) throws UserNotFoundException {
        log.debug("get by id user: {}", id);
        if (id != null) {
            Optional<User> found = userRepository.findById(id);
            if (found.isPresent()) {
                return found.get();
            }
        }
        throw new UserNotFoundException("User not found");
    }

    /**
     * Retrieves a user entity by its email.
     *
     * @param email The email of the user to retrieve.
     * @return An optional containing the retrieved user entity, or empty if not found.
     */
    public Optional<User> findByEmail(String email) {
        log.debug("get by email user: {}", email);
        return userRepository.findByEmail(email);
    }

    /**
     * Retrieves a user entity by email and verification status.
     *
     * @param email The email of the user to retrieve.
     * @return An optional containing the retrieved user entity, or empty if not found.
     */
    public Optional<User> findByEmailAndIsVerified(String email) {
        log.debug("get by email user: {}", email);
        return userRepository.findByEmailAndIsVerified(email, true);
    }

    /**
     * Retrieves a user entity by verification hash.
     *
     * @param verifyHash The verification hash of the user to retrieve.
     * @return An optional containing the retrieved user entity, or empty if not found.
     */
    public Optional<User> findByVerifyHash(String verifyHash) {
        log.debug("verify hash: {}", verifyHash);
        return userRepository.findByVerifyHash(verifyHash);
    }

    /**
     * Retrieves a user entity by password reset hash.
     *
     * @param resetHash The reset hash of the user to retrieve.
     * @return The retrieved user entity.
     * @throws UserNotFoundException If the user with the specified reset hash is not found.
     */
    public User findByPasswordResetHash(String resetHash) throws UserNotFoundException {
        log.debug("reset password hash: {}", resetHash);
        var userOptional = userRepository.findByPasswordResetHash(resetHash);
        if (userOptional.isPresent()) {
            return userOptional.get();
        }

        throw new UserNotFoundException("User with that reset hash not found");
    }

    /**
     * Retrieves a user entity by email.
     *
     * @param email The email of the user to retrieve.
     * @return The retrieved user entity.
     * @throws UserNotFoundException If the user with the specified email is not found.
     */
    public User getUserByEmail(String email) throws UserNotFoundException {
        log.debug("getArchivalRecordById {}", email);
        if (email != null) {
            Optional<User> found = userRepository.findByEmail(email);
            if (found.isPresent()) {
                return found.get();
            }
        }
        throw new UserNotFoundException("Uzivatel nebol najdeny podla zadaneho mailu");
    }
}
