package cz.vut.fit.archiveMaterials.backend.core.utils;

import cz.vut.fit.archiveMaterials.backend.api.domain.dto.AuthUser;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

/**
 * Utility class for handling JWT (JSON Web Token) operations.
 *
 * <p>This class provides methods for generating access tokens, validating tokens,
 * and extracting token subject information.</p>
 *
 * <p>The secret key used for signing JWTs is generated randomly when the application starts.</p>
 *
 * <p>Uses the SLF4J logging framework for logging.</p>
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class JwtTokenUtil {

    private static final long EXPIRE_DURATION = 24 * 60 * 60 * 1000; // 24 hour

    private String SECRET_KEY;

    /**
     * Initializes the JwtTokenUtil by generating a random secret key when the application starts.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        this.SECRET_KEY = generateRandomKey();
        log.info("JWT secret key generated.");
    }

    /**
     * Generates a random secret key for signing JWTs.
     *
     * @return The generated random secret key.
     */
    private String generateRandomKey() {
        // You can customize the length or complexity of the key as needed
        SecureRandom secureRandom = new SecureRandom();
        byte[] keyBytes = new byte[64];
        secureRandom.nextBytes(keyBytes);
        return Base64.getEncoder().encodeToString(keyBytes);
    }

    /**
     * Generates an access token for the given AuthUser.
     *
     * @param user The AuthUser for whom the token is generated.
     * @return The generated access token.
     * @throws Exception If an error occurs during token generation.
     */
    public String generateAccessToken(AuthUser user) throws Exception{
        try{
            log.debug("start generating token");
            return Jwts.builder()
                    .setSubject(String.format("%s", user.getEmail()))
                    //.setIssuer("CodeJava")
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_DURATION))
                    .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                    .compact();
        }
        catch (Exception e){
            log.error("Creating token exception", e.getMessage());
            throw e;
        }
    }

    /**
     * Validates the given access token.
     *
     * @param token The access token to validate.
     * @return True if the token is valid, false otherwise.
     */
    public boolean validateAccessToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            log.error("JWT expired", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("Token is null, empty or only whitespace", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("JWT is invalid", ex);
        } catch (UnsupportedJwtException ex) {
            log.error("JWT is not supported", ex);
        } catch (SignatureException ex) {
            log.error("Signature validation failed");
        }

        return false;
    }

    /**
     * Gets the subject of the given token.
     *
     * @param token The token from which to extract the subject.
     * @return The subject of the token.
     */
    public String getSubject(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Parses the claims of the given token.
     *
     * @param token The token to parse.
     * @return The claims of the token.
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}