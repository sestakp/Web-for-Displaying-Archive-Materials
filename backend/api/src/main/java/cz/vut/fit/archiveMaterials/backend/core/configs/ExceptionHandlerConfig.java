package cz.vut.fit.archiveMaterials.backend.core.configs;

import cz.vut.fit.archiveMaterials.backend.core.controller.CommonResponseEntityExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for setting up the exception handling mechanism in the application.
 *
 * <p>This class provides a configuration for creating an instance of {@link CommonResponseEntityExceptionHandler},
 * which is responsible for handling common exceptions thrown within the application and returning appropriate
 * responses. It is annotated with {@link Configuration} to indicate that it contains configuration beans.</p>
 */
@Configuration
public class ExceptionHandlerConfig {

    /**
     * Default constructor for the {@link ExceptionHandlerConfig} class.
     */
    public ExceptionHandlerConfig() {
    }

    /**
     * Creates a bean for the {@link CommonResponseEntityExceptionHandler}.
     *
     * <p>This method is annotated with {@link Bean}, indicating that it will produce a bean of type
     * {@link CommonResponseEntityExceptionHandler}. The returned instance is responsible for handling common
     * exceptions thrown within the application and returning appropriate responses.</p>
     *
     * @return An instance of {@link CommonResponseEntityExceptionHandler}.
     */
    @Bean
    public CommonResponseEntityExceptionHandler commonResponseEntityExceptionHandler() {
        return new CommonResponseEntityExceptionHandler();
    }
}
