package cz.vut.fit.archiveMaterials.backend.core.configs;


import cz.vut.fit.archiveMaterials.backend.api.domain.repository.UserRepository;
import cz.vut.fit.archiveMaterials.backend.core.filters.JwtTokenFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuration class for setting up security in the application.
 *
 * <p>This class is annotated with {@link Configuration} and {@link EnableWebSecurity} to indicate that it contains
 * security-related configurations. It also uses {@link RequiredArgsConstructor} for constructor-based dependency injection.</p>
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenFilter jwtTokenFilter;

    private final UserRepository userRepository;

    /**
     * Creates a bean for the user details service.
     *
     * <p>This method is annotated with {@link Bean}, indicating that it will produce a bean of type
     * {@link UserDetailsService}. The returned instance is responsible for loading user details based on the provided
     * username.</p>
     *
     * @return An instance of {@link UserDetailsService}.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {

            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepository.findByEmailAndIsVerified(username, true)
                        .orElseThrow(
                                () -> new UsernameNotFoundException("User " + username + " not found"));
            }
        };
    }

    /**
     * Creates a bean for the authentication manager.
     *
     * <p>This method is annotated with {@link Bean}, indicating that it will produce a bean of type
     * {@link AuthenticationManager}. The returned instance is responsible for authenticating users based on the provided
     * authentication configuration.</p>
     *
     * @param authConfig The {@link AuthenticationConfiguration} used for configuring authentication.
     * @return An instance of {@link AuthenticationManager}.
     * @throws Exception If an error occurs while configuring the authentication manager.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


    /**
     * Creates a bean for the password encoder.
     *
     * <p>This method is annotated with {@link Bean}, indicating that it will produce a bean of type
     * {@link PasswordEncoder}. The returned instance is responsible for encoding and verifying passwords.</p>
     *
     * @return An instance of {@link PasswordEncoder}.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    /**
     * Configures security settings for HTTP requests.
     *
     * <p>This method is annotated with {@link Bean}, indicating that it will produce a bean of type
     * {@link SecurityFilterChain}. It configures security settings such as CSRF protection, session management, URL
     * authorization, exception handling, and filters.</p>
     *
     * @param http The {@link HttpSecurity} instance to configure.
     * @return A {@link SecurityFilterChain} instance.
     * @throws Exception If an error occurs during the security configuration.
     */
    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.authorizeHttpRequests()
                .requestMatchers("/api/users").authenticated() //update user credentials
                .anyRequest().permitAll();

        http.exceptionHandling()
                .authenticationEntryPoint(
                        (request, response, ex) -> {
                            response.sendError(
                                    HttpServletResponse.SC_UNAUTHORIZED,
                                    ex.getMessage()
                            );
                        }
                );

        http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
