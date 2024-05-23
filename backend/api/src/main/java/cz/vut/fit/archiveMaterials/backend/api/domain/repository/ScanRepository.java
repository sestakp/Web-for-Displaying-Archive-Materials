package cz.vut.fit.archiveMaterials.backend.api.domain.repository;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for accessing Scan entities from the database.
 */
@Repository
public interface ScanRepository extends JpaRepository<Scan, String>,
        JpaSpecificationExecutor<Scan> {

    /**
     * Retrieves all scans associated with a specific ArchivalRecord.
     *
     * @param archivalRecordId The ID of the ArchivalRecord to retrieve scans for.
     * @return A list of Scan objects associated with the specified ArchivalRecord.
     */
    List<Scan> findAllByArchivalRecordId(Long archivalRecordId);
}
