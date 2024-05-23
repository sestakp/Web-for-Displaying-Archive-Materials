package cz.vut.fit.archiveMaterials.backend.api.domain.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexedEmbedded;

import java.time.LocalDateTime;

@Data
@Entity
@Indexed
@Table(
        name = "bookmark",
        indexes = {
                @Index(name = "idx_archival_record_id", columnList = "archival_record_id"),
                @Index(name = "idx_scan_url", columnList = "scan_url", unique = true)
        }
)
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "scan_url")
    private Scan scan;

    @Lob
    @Column(name = "text")
    private String text;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "archival_record_id")
    private ArchivalRecord archivalRecord;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @IndexedEmbedded
    private User user;



    @Column(name = "scan_number")
    private Integer scanNumber;


    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

}