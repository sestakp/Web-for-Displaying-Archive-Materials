package cz.vut.fit.archiveMaterials.backend.api.controller;

import cz.vut.fit.archiveMaterials.backend.api.ElasticSeachControllerApi;
import cz.vut.fit.archiveMaterials.backend.api.service.ElasticSearchIndexingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller class for managing Elasticsearch indexing operations.
 */

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ElasticSearchController implements ElasticSeachControllerApi {

    private final ElasticSearchIndexingService indexingService;

    /**
     * Initiates Elasticsearch reindexing.
     *
     * @return ResponseEntity indicating the status of the reindexing operation.
     */
    @Override
    public ResponseEntity<String> reindex() {
        indexingService.reindexElasticSearch();

        return ResponseEntity.ok("Indexing started. You can check progress using /progress endpoint.");
    }

    /**
     * Retrieves the progress of Elasticsearch indexing.
     *
     * @return ResponseEntity containing the current indexing progress or status.
     */
    @Override
    public ResponseEntity<String> progress() {
        return ResponseEntity.ok(indexingService.getIndexingProgress());
    }
}
