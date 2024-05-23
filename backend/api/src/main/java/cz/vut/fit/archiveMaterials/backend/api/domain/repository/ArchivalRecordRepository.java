package cz.vut.fit.archiveMaterials.backend.api.domain.repository;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing {@link ArchivalRecord} entities.
 *
 * <p>This interface extends {@link JpaRepository} to provide basic CRUD operations and
 * {@link JpaSpecificationExecutor} for executing specifications-based queries.</p>
 */
@Repository
public interface ArchivalRecordRepository extends JpaRepository<ArchivalRecord, Long>,
        JpaSpecificationExecutor<ArchivalRecord> {
    /**
     * Finds an ArchivalRecord by its link.
     *
     * @param link The link of the ArchivalRecord to find.
     * @return An Optional containing the found ArchivalRecord, or empty if not found.
     */
    Optional<ArchivalRecord> findByLink(String link);

}
