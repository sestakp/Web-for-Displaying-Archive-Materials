package cz.vut.fit.archiveMaterials.backend.core.commandLineRunners;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ReindexingStatus;
import cz.vut.fit.archiveMaterials.backend.api.domain.enums.ReindexingTimeConstants;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ArchiveRepository;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ReindexingStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * A command-line runner for initializing reindexing status.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ReindexingStatusCommandLineRunner implements CommandLineRunner {

    private final ReindexingStatusRepository reindexingStatusRepository;

    /**
     * Initializes the reindexing status when the application starts.
     * If no status is found, initializes with default values.
     * @param args The command-line arguments (unused).
     */
    @Override
    @Transactional
    public void run(String... args) {

        var statusOptional = reindexingStatusRepository.findFirstByOrderByIdAsc();

        if(statusOptional.isEmpty()){
            var status = new ReindexingStatus();
            status.setLastReindexingStartTime(ReindexingTimeConstants.MIN_DATE.getValue());
            reindexingStatusRepository.save(status);
            log.info("Initial indexing status seeded");
        }
    }

}
