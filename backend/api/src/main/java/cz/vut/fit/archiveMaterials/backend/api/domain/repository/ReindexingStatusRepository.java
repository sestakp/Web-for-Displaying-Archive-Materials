package cz.vut.fit.archiveMaterials.backend.api.domain.repository;


import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ReindexingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReindexingStatusRepository extends JpaRepository<ReindexingStatus, Long> {

    Optional<ReindexingStatus> findFirstByOrderByIdAsc();
}
