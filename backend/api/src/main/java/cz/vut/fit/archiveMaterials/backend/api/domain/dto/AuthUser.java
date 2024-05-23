package cz.vut.fit.archiveMaterials.backend.api.domain.dto;

import lombok.Data;

/**
 * Represents an authenticated user with essential user information.
 *
 * <p>The class is annotated with Lombok's {@code @Data}, which automatically generates
 * boilerplate code for getters, setters, equals, hashCode, and toString methods.</p>
 */
@Data
public class AuthUser {

    private Long id;

    /**
     * The email address of the authenticated user.
     */
    private String email;

    /**
     * The password associated with the user's account.
     */
    private String password;

    /**
     * The name of user
     */
    private String name;

    /**
     * The access token assigned to the authenticated user after successful login.
     */
    private String accessToken;
}
