package cz.vut.fit.archiveMaterials.backend.api.domain.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;

import java.util.ArrayList;
import java.util.Collection;

@Data
@Entity
@Indexed
@Table(
        name = "scan",
        indexes = {
                @Index(name = "idx_archival_record_id", columnList = "archival_record_id")
        }
)
public class Scan {

    @Id
    private String url;

    private String preFetchUrl;

    private Integer orderNumber;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST})
    @JoinColumn(name = "archival_record_id")
    private ArchivalRecord archivalRecord;

    @OneToMany(mappedBy = "scan", cascade = {CascadeType.REMOVE, CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private Collection<Bookmark> bookmarks = new ArrayList<>();

    @OneToMany(mappedBy = "scan", cascade = {CascadeType.REMOVE, CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    private Collection<Note> notes = new ArrayList<>();
}
