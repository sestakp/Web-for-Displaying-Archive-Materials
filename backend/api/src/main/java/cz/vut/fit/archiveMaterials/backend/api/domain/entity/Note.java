package cz.vut.fit.archiveMaterials.backend.api.domain.entity;

import cz.vut.fit.archiveMaterials.backend.api.dto.AccessibilityEnum;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import lombok.Data;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexedEmbedded;

import java.time.LocalDateTime;

@Data
@Entity
@Indexed
@Table(
        name = "note",
        indexes = {
                @Index(name = "idx_archival_record_id", columnList = "archival_record_id"),
                @Index(name = "idx_search", columnList = "archival_record_id, accessibility, user_id"),
                @Index(name = "idx_search_2", columnList = "scan_url, user_id, accessibility", unique = true)
        }
)
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "scan_url")
    private Scan scan;

    @Lob
    @Column(name = "data", columnDefinition = "LONGTEXT") //longtext can store up to 4GB
    private String data;

    @Lob
    @Column(name = "text")
    private String text;

    @Column(name = "accessibility")
    @Enumerated(EnumType.STRING)
    private AccessibilityEnum accessibility;


    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "archival_record_id")
    private ArchivalRecord archivalRecord;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @IndexedEmbedded
    private User user;



    @Column(name = "scan_number")
    private Integer scanNumber;

}
