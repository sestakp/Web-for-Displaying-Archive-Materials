package cz.vut.fit.archiveMaterials.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * The main class for starting the Archive Materials Backend application.
 * This class is annotated with {@code @SpringBootApplication}, which indicates that it is the primary
 * configuration class for the Spring Boot application. It contains the {@code main} method to launch
 * the application. Additionally, the {@code @EnableTransactionManagement} annotation is used to enable
 * Spring's annotation-driven transaction management.
 */
@SpringBootApplication
@EnableTransactionManagement
public class ArchiveMaterialsBackendApplication {

	/**
	 * The entry point of the application.
	 *
	 * @param args The command line arguments passed to the application.
	 */
	public static void main(String[] args) {
		SpringApplication.run(ArchiveMaterialsBackendApplication.class, args);
	}

}
