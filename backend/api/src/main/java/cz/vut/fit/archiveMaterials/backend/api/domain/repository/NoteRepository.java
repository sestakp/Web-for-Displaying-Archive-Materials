package cz.vut.fit.archiveMaterials.backend.api.domain.repository;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Note;
import cz.vut.fit.archiveMaterials.backend.api.dto.AccessibilityEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository  extends JpaRepository<Note, Long>,
        JpaSpecificationExecutor<Note> {

    List<Note> findAllByArchivalRecordId(Long archivalRecordId);

    @Query("SELECT n FROM Note n WHERE n.archivalRecord.id = :archivalRecordId AND (n.accessibility = 'PUBLIC' OR n.user.id = :userId)")
    List<Note> findByArchivalRecordIdAndAccessibilityOrUserId(
            @Param("archivalRecordId") Long archivalRecordId,
            @Param("userId") Long userId);

    Optional<Note> findByScanUrlAndUserIdAndAccessibility(String scanUrl, Long userId , AccessibilityEnum accessibility);
}
