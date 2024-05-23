package cz.vut.fit.archiveMaterials.backend.api.service;

import cz.vut.fit.archiveMaterials.backend.api.domain.dto.AuthUser;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.mapper.UserMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.ArchivalRecordPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.PasswordResetDto;
import cz.vut.fit.archiveMaterials.backend.api.exception.ArchivalRecordNotFoundException;
import cz.vut.fit.archiveMaterials.backend.api.exception.UserNotFoundException;
import cz.vut.fit.archiveMaterials.backend.core.utils.JwtTokenUtil;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserPersistenceService persistenceService;
    private final ArchivalRecordPersistenceService archivalRecordPersistenceService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtTokenUtil jwtUtil;
    private final UserMapper userMapper;
    private final EmailService emailService;

    @Value("${mail.enabled}")
    private Integer mailEnabled;

    @Value("${backend.url}")
    private String backendUrl;

    @Value("${frontend.url}")
    private String frontendUrl;

    /**
     * Registers a new user.
     *
     * @param user The user to register.
     * @return The registered user.
     */
    public User registerUser(User user) {
        log.debug("Register user: {}", user);
        user.setEmail(user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerifyHash(UUID.randomUUID().toString());
        user.setLastUpdated(LocalDateTime.now());

        if (mailEnabled == 1) {
            user.setVerified(false);
            emailService.sendEmail(user.getEmail(),
                    "Ověření účtu pro prohlížení archiválií",
                    "Prosím ověřte Váš účet na adrese: " + backendUrl + "/api/users/verification/"
                            + user.getVerifyHash()
            );
        } else {
            user.setVerified(true);
        }

        return persistenceService.persist(user);
    }

    /**
     * Log in a user.
     *
     * @param user The user to log in.
     * @return The authenticated user.
     * @throws Exception If authentication fails.
     */
    public AuthUser loginUser(AuthUser user) throws Exception {
        log.debug("Login user: {}", user);
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );
        var userEntity = (User) authentication.getPrincipal();

        // toto sa nikdy nestane
        if (!userEntity.isIsVerified()) {
            throw new AccessDeniedException("User must be verified");
        }

        user = userMapper.map(userEntity);
        user.setAccessToken(jwtUtil.generateAccessToken(user));
        return user;
    }

    /**
     * Updates user information.
     *
     * @param user The updated user information.
     * @return The updated user.
     */
    @Transactional
    public User updateUser(User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {
            var userOrNull = persistenceService.findByEmailAndIsVerified(userFromCredentials.getEmail());
            if (userOrNull.isEmpty()) {
                throw new AccessDeniedException("User not found or not verified");
            }

            var userStored = userOrNull.get();

            if (user.getEmail() != null) {
                userStored.setEmail(user.getEmail());
            }

            if (user.getName() != null) {
                userStored.setName(user.getName());
            }

            if (user.getPassword() != null) {
                userStored.setPassword(passwordEncoder.encode(user.getPassword()));
            }

            userStored.setLastUpdated(LocalDateTime.now());
            return persistenceService.persist(userStored);
        }
        throw new AccessDeniedException("User not found or not verified");
    }

    /**
     * Verifies a user's verification hash.
     *
     * @param verifyHash The verification hash to verify.
     * @return A message indicating the result of the verification.
     */
    @Transactional
    public String verifyHash(String verifyHash) {

        var userOptional = persistenceService.findByVerifyHash(verifyHash);

        if (userOptional.isPresent()) {

            var user = userOptional.get();

            user.setVerifyHash(null);
            user.setVerified(true);
            return "Účet úspěšně ověřen";
        }

        return "Uživatelský účet nenalezen";
    }

    /**
     * Adds an archival record to the user's favorites.
     *
     * @param archivalRecordId The ID of the archival record to add to favorites.
     * @throws ArchivalRecordNotFoundException If the associated archival record is not found.
     */
    @Transactional
    public void AddArchivalRecordToFavourites(Long archivalRecordId) throws ArchivalRecordNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {

            var userOrNull = persistenceService.findByEmailAndIsVerified(userFromCredentials.getEmail());
            if (userOrNull.isEmpty()) {
                log.error("User not found or not verified");
                throw new AccessDeniedException("User not found or not verified");
            }

            var userStored = userOrNull.get();

            var archivalRecord = archivalRecordPersistenceService.getArchivalRecordById(archivalRecordId);

            if (!userStored.getFavouriteArchivalRecords().contains(archivalRecord)) {
                userStored.getFavouriteArchivalRecords().add(archivalRecord);
                archivalRecord.getFavouritesByUsers().add(userStored);
            }
            archivalRecordPersistenceService.persist(archivalRecord);
            persistenceService.persist(userStored);
        } else {
            throw new AccessDeniedException("User not found or not verified");
        }


    }

    /**
     * Removes an archival record from the user's favorites.
     *
     * @param archivalRecordId The ID of the archival record to remove from favorites.
     * @throws ArchivalRecordNotFoundException If the associated archival record is not found.
     */
    @Transactional
    public void RemoveArchivalRecordFromFavourites(Long archivalRecordId) throws ArchivalRecordNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User userFromCredentials) {
            var userOrNull = persistenceService.findByEmailAndIsVerified(userFromCredentials.getEmail());
            if (userOrNull.isEmpty()) {
                throw new AccessDeniedException("User not found or not verified");
            }

            var userStored = userOrNull.get();

            var archivalRecord = archivalRecordPersistenceService.getArchivalRecordById(archivalRecordId);

            if (userStored.getFavouriteArchivalRecords().contains(archivalRecord)) {
                userStored.getFavouriteArchivalRecords().remove(archivalRecord);
                archivalRecord.getFavouritesByUsers().remove(userStored);
            }
            archivalRecordPersistenceService.persist(archivalRecord);
            persistenceService.persist(userStored);
        } else {
            throw new AccessDeniedException("User not found or not verified");
        }
    }

    /**
     * Sends a password reset hash to the user's email.
     *
     * @param email The email of the user requesting the password reset.
     * @throws UserNotFoundException If the user is not found.
     */
    @Transactional
    public void SendPasswordResetHash(String email) throws UserNotFoundException {
        var user = persistenceService.getUserByEmail(email);

        user.setPasswordResetHash(UUID.randomUUID().toString());
        emailService.sendEmail(user.getEmail(),
                "Resetovní hesla k účtu pro prohlížení archiválií",
                "Prosím změňte si Váše heslo na adrese: " + frontendUrl + "/reset-password/"
                        + user.getPasswordResetHash()
        );
    }

    /**
     * Resets the password for a user.
     *
     * @param data The password reset data.
     * @throws UserNotFoundException If the user is not found.
     */
    @Transactional
    public void PasswordReset(PasswordResetDto data) throws UserNotFoundException {

        var user = persistenceService.findByPasswordResetHash(data.getHash());

        user.setPassword(passwordEncoder.encode(data.getPassword()));
        user.setPasswordResetHash(null);
        persistenceService.persist(user);
    }
}
