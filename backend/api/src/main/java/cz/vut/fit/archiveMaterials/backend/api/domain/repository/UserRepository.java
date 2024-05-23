package cz.vut.fit.archiveMaterials.backend.api.domain.repository;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

/**
 * Repository interface for managing {@link User} entities.
 *
 * <p>This interface extends {@link JpaRepository} and {@link JpaSpecificationExecutor} to provide basic CRUD operations and
 * specification-based queries for the {@link User} entity.</p>
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {

    /**
     * Finds a user by email.
     *
     * <p>This method searches for a user with the specified email.</p>
     *
     * @param email The email of the user.
     * @return An {@link Optional} containing the user with the specified email, or an empty {@link Optional} if no match is found.
     */
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailAndIsVerified(String email, boolean verified);


    Optional<User> findByVerifyHash(String hash);

    Optional<User> findByPasswordResetHash(String hash);
}
