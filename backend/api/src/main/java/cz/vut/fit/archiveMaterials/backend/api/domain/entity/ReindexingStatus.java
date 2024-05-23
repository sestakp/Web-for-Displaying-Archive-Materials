package cz.vut.fit.archiveMaterials.backend.api.domain.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
public class ReindexingStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "last_reindexing_start_time")
    private LocalDateTime lastReindexingStartTime;

}
