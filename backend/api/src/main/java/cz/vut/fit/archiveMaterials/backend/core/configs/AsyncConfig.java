package cz.vut.fit.archiveMaterials.backend.core.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;


/**
 * Configuration class for asynchronous processing.
 *
 * <p>Provides configuration for asynchronous processing using a thread pool.</p>
 *
 * Configuration Indicates that a class declares one or more bean methods and may be processed by the Spring container
 * to generate bean definitions and service requests for those beans at runtime.
 *
 * EnableAsync Enables Spring's asynchronous method execution capability, similar to functionality found in Spring's
 * <code>&lt;task:*> XML namespace</code>.
 */
@Configuration
@EnableAsync
public class AsyncConfig {


    /**
     * Creates a bean for the asynchronous executor.
     *
     * <p>The executor is configured with core pool size, max pool size,
     * and queue capacity based on available processors.</p>
     *
     * @return The configured asynchronous executor.
     */
    @Bean(name = "asyncExecutor")
    public ThreadPoolTaskExecutor asyncExecutor() {
        int corePoolSize = Runtime.getRuntime().availableProcessors() * 3 / 4;
        int maxPoolSize = Runtime.getRuntime().availableProcessors();
        int queueCapacity = Runtime.getRuntime().availableProcessors() * 10;

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setThreadNamePrefix("AsyncThread-");
        executor.initialize();
        return executor;
    }
}
