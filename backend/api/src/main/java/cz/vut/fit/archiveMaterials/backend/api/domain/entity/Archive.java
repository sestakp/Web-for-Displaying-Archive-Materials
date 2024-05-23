package cz.vut.fit.archiveMaterials.backend.api.domain.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.vut.fit.archiveMaterials.backend.api.domain.enums.ArchiveState;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Collection;
import lombok.Data;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

@Data
@Entity
@Table(name = "archive", indexes = {
        @Index(name = "idx_abbreviation", columnList = "abbreviation", unique = true),
        @Index(name = "idx_name", columnList = "name", unique = true)
})
public class Archive {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name", nullable = false, columnDefinition = "TEXT")
    @KeywordField(normalizer = "czech", sortable = Sortable.YES)
    private String name;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT", length = 2048)
    private String description;

    @Column(name = "state")
    @Enumerated(EnumType.STRING)
    private ArchiveState state;

    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    @FullTextField(analyzer = "czech")
    private String address;

    @Column(name = "abbreviation")
    @KeywordField
    private String abbreviation;

    @OneToMany(mappedBy = "archive", cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<ArchivalRecord> archivalRecords;


    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}
