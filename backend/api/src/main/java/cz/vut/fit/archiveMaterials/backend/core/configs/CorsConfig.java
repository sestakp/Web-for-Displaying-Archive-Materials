package cz.vut.fit.archiveMaterials.backend.core.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * Configuration class for Cross-Origin Resource Sharing (CORS).
 *
 * <p>Configures CORS support for the application by defining allowed origins, methods, headers, and credentials.</p>
 *
 * Configuration Indicates that a class declares one or more bean methods and may be processed by the Spring container
 * to generate bean definitions and service requests for those beans at runtime.
 */
@Configuration
public class CorsConfig {

    @Value("${frontend.url}")
    private String frontendUrl;

    /**
     * Creates a {@link FilterRegistrationBean} for the CORS filter.
     *
     * <p>Configures CORS filter with allowed origins, methods, headers, and credentials. Registers the filter with
     * highest precedence.</p>
     *
     * @return The configured {@link FilterRegistrationBean} for the CORS filter.
     */
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "http://localhost:4200", "http://perun.fit.vutbr.cz:8083", "http://perun.fit.vutbr.cz:8082","http://perun.fit.vutbr.cz:8084", "http://perun.fit.vutbr.cz:8085" ,"http://localhost:8083", frontendUrl));
        corsConfiguration.addAllowedMethod("GET");
        corsConfiguration.addAllowedMethod("POST");
        corsConfiguration.addAllowedMethod("PUT");
        corsConfiguration.addAllowedMethod("DELETE");
        corsConfiguration.addAllowedMethod("OPTIONS");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        FilterRegistrationBean<CorsFilter> registrationBean = new FilterRegistrationBean<>(new CorsFilter(source));
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registrationBean;
    }

}
