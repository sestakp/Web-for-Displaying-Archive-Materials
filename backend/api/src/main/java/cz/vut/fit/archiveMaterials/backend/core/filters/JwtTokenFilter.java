package cz.vut.fit.archiveMaterials.backend.core.filters;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.User;
import java.io.IOException;

import cz.vut.fit.archiveMaterials.backend.core.utils.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Custom JWT Token Filter to handle authentication using JWT tokens.
 */
@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtUtil;

    /**
     * Filters incoming HTTP requests. Checks for the presence of a valid JWT token in the Authorization header.
     * If a valid token is found, sets the authentication context for the request.
     *
     * @param request     The HTTP request.
     * @param response    The HTTP response.
     * @param filterChain The filter chain.
     * @throws ServletException If a servlet-specific error occurs.
     * @throws IOException      If an I/O error occurs.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (!hasAuthorizationBearer(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = getAccessToken(request);

        if (!jwtUtil.validateAccessToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        setAuthenticationContext(token, request);
        filterChain.doFilter(request, response);
    }

    /**
     * Checks if the request contains a valid Authorization header with a Bearer token.
     *
     * @param request The HTTP request.
     * @return {@code true} if the Authorization header is present and starts with "Bearer"; {@code false} otherwise.
     */
    private boolean hasAuthorizationBearer(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (ObjectUtils.isEmpty(header) || !header.startsWith("Bearer")) {
            return false;
        }

        return true;
    }

    /**
     * Extracts the Bearer token from the Authorization header.
     *
     * @param request The HTTP request.
     * @return The Bearer token.
     */
    private String getAccessToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token = header.split(" ")[1].trim();
        return token;
    }

    /**
     * Sets the authentication context for the request based on the provided JWT token.
     *
     * @param token   The JWT token.
     * @param request The HTTP request.
     */
    private void setAuthenticationContext(String token, HttpServletRequest request) {
        UserDetails userDetails = getUserDetails(token);

        UsernamePasswordAuthenticationToken
                authentication = new UsernamePasswordAuthenticationToken(userDetails, null, null);

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    /**
     * Retrieves user details from the JWT token.
     *
     * @param token The JWT token.
     * @return User details extracted from the token.
     */
    private UserDetails getUserDetails(String token) {
        User userDetails = new User();
        String jwtSubject = jwtUtil.getSubject(token);//.split(",");

        //userDetails.setId(UUID.fromString(jwtSubject[0]));
        //userDetails.setEmail(jwtSubject[1]);
        userDetails.setEmail(jwtSubject);

        return userDetails;
    }
}