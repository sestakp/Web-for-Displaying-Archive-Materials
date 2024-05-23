package cz.vut.fit.archiveMaterials.backend.api.controller;

import cz.vut.fit.archiveMaterials.backend.api.UserControllerApi;
import cz.vut.fit.archiveMaterials.backend.api.controller.mapper.UserDtoMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.dto.AuthUser;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.UserPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.AuthRequestDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.AuthResponseDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.PasswordResetDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.RegisterRequestDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.RegisterResponseDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.UserDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.UserUpdateDto;
import cz.vut.fit.archiveMaterials.backend.api.service.UserService;
import cz.vut.fit.archiveMaterials.backend.core.controller.RestControllerExceptionHandler;
import cz.vut.fit.archiveMaterials.backend.core.controller.exceptions.ObjectException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller class for handling user-related operations. Implements the UserControllerApi interface.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController implements UserControllerApi {

    private final UserDtoMapper mapper;
    private final UserService service;
    private final UserPersistenceService persistenceService;


    /**
     * Handles the login request for a user.
     *
     * @param authRequestDto The DTO containing authentication request details.
     * @return ResponseEntity with the authentication response DTO.
     */
    @Override
    public ResponseEntity<AuthResponseDto> loginUser(@Valid AuthRequestDto authRequestDto) throws Exception {
        log.info("loginUser {}", authRequestDto.getEmail());

        AuthUser user = mapper.map(authRequestDto);
        AuthUser login = service.loginUser(user);
        AuthResponseDto dto = mapper.mapAuth(login);
        return ResponseEntity.ok(dto);
    }

    /**
     * Handles the registration request for a new user.
     *
     * @param registerRequestDto The DTO containing registration request details.
     * @return ResponseEntity with the registration response DTO.
     */
    @Override
    public ResponseEntity<RegisterResponseDto> registerUser(@Valid RegisterRequestDto registerRequestDto) {
        log.info("registerUser {}", registerRequestDto);

        User user = mapper.map(registerRequestDto);
        User register = service.registerUser(user);
        RegisterResponseDto dto = mapper.map(register);
        return ResponseEntity.ok(dto);
    }

    /**
     * Updates the user information.
     *
     * @param userUpdateDto The DTO containing the updated user information.
     * @return ResponseEntity representing the updated user detail.
     */
    @Override
    public ResponseEntity<UserDetailDto> updateUser(@Valid UserUpdateDto userUpdateDto) {
        log.info("updateUser {}", userUpdateDto);

        var user = mapper.map(userUpdateDto);
        var updateUser = service.updateUser(user);
        var dto = mapper.mapToDetail(updateUser);
        return ResponseEntity.status(HttpStatus.OK).body(dto);
    }

    /**
     * Verifies the user based on the verification hash.
     *
     * @param verifyHash The verification hash.
     * @return ResponseEntity containing the verification result.
     */
    @Override
    public ResponseEntity<String> verifyUser(String verifyHash) {
        return ResponseEntity.ok(service.verifyHash(verifyHash));
    }

    /**
     * Retrieves user details by email.
     *
     * @param email The email of the user.
     * @return ResponseEntity containing the user details.
     */
    @Override
    public ResponseEntity<UserDetailDto> getUserByEmail(String email) {
        try {
            log.info("getUserByEmail {}", email);
            var user = persistenceService.getUserByEmail(email);
            var dto = mapper.mapToDetail(user);
            return ResponseEntity.ok(dto);
        } catch (ObjectException e) {
            return RestControllerExceptionHandler.handleException(e);
        }
    }

    /**
     * Adds an archival record to the user's favorites.
     *
     * @param id The ID of the archival record.
     * @return ResponseEntity indicating success.
     * @throws Exception if an error occurs during the operation.
     */
    @Override
    public ResponseEntity<Void> addToFavourites(Long id) throws Exception {
        service.AddArchivalRecordToFavourites(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Removes an archival record from the user's favorites.
     *
     * @param id The ID of the archival record.
     * @return ResponseEntity indicating success.
     * @throws Exception if an error occurs during the operation.
     */
    @Override
    public ResponseEntity<Void> removeFromFavourites(Long id) throws Exception {
        service.RemoveArchivalRecordFromFavourites(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Resets the user's password.
     *
     * @param passwordResetDto The DTO containing the new password.
     * @return ResponseEntity indicating success.
     * @throws Exception if an error occurs during the password reset process.
     */
    @Override
    public ResponseEntity<Void> passwordReset(@Valid PasswordResetDto passwordResetDto) throws Exception {
        service.PasswordReset(passwordResetDto);
        return ResponseEntity.ok().build();
    }

    /**
     * Sends a password reset request to the user's email.
     *
     * @param email The email of the user requesting the password reset.
     * @return ResponseEntity indicating success.
     * @throws Exception if an error occurs during the password reset request process.
     */
    @Override
    public ResponseEntity<Void> passwordResetRequest(String email) throws Exception {
        service.SendPasswordResetHash(email);
        return ResponseEntity.ok().build();
    }
}
