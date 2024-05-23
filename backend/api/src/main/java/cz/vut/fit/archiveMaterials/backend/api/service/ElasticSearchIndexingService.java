package cz.vut.fit.archiveMaterials.backend.api.service;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location;
import cz.vut.fit.archiveMaterials.backend.api.domain.enums.ReindexingTimeConstants;
import cz.vut.fit.archiveMaterials.backend.api.domain.repository.ReindexingStatusRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.massindexing.MassIndexer;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing Elasticsearch indexing operations.
 */
@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
@RequiredArgsConstructor
public class ElasticSearchIndexingService {


    private final EntityManager entityManager;
    private final ReindexingStatusRepository reindexingStatusRepository;

    // Create a formatter for Czech datetime
    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss", new Locale("cs"));

    private volatile CompletableFuture<?> indexingTask;


    /**
     * Asynchronously reindexes Elasticsearch.
     *
     * @return A CompletableFuture representing the reindexing task.
     * @throws RuntimeException If another indexing task is already in progress.
     */
    @Async
    @Transactional
    public CompletableFuture<?> reindexElasticSearch() throws RuntimeException {
        if (isIndexingInProgress()) {
            throw new RuntimeException("Another indexing task is already in progress.");
        }

        SearchSession searchSession = Search.session(entityManager);
        MassIndexer indexer = searchSession.massIndexer(ArchivalRecord.class, Location.class).threadsToLoadObjects(7);

        var reindexingStatusOptional = reindexingStatusRepository.findFirstByOrderByIdAsc();

        if (reindexingStatusOptional.isEmpty()) {
            throw new IllegalStateException("Initial status missing");
        }

        var status = reindexingStatusOptional.get();

        var oldTime = status.getLastReindexingStartTime();

        try {
            status.setLastReindexingStartTime(LocalDateTime.now());
            indexingTask = indexer.start().toCompletableFuture();

            indexingTask.complete(null);
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            status.setLastReindexingStartTime(oldTime);
            indexingTask.completeExceptionally(e);
        }

        return indexingTask;
    }

    /**
     * Checks if indexing is in progress.
     *
     * @return true if indexing is in progress, false otherwise.
     */
    private boolean isIndexingInProgress() {
        return indexingTask != null;
    }

    /**
     * Retrieves the indexing progress.
     *
     * @return A string indicating the indexing progress or status.
     */
    @Transactional(readOnly = true)
    public String getIndexingProgress() {
        var reindexingStatusOptional = reindexingStatusRepository.findFirstByOrderByIdAsc();

        if (reindexingStatusOptional.isEmpty()) {
            throw new IllegalStateException("Initial status missing");
        }

        var status = reindexingStatusOptional.get();

        if (isIndexingInProgress()) {
            return "Manual indexing is in progress. Started at: " + status.getLastReindexingStartTime()
                    .format(ElasticSearchIndexingService.formatter);
        } else {
            if (status.getLastReindexingStartTime().equals(ReindexingTimeConstants.MIN_DATE.getValue())) {
                return "Manual Indexing has not yet been initiated";
            }

            return "Manual indexing is not running, last indexing started: " + status.getLastReindexingStartTime()
                    .format(ElasticSearchIndexingService.formatter);
        }
    }
}
