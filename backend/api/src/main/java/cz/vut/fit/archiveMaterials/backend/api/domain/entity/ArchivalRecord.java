package cz.vut.fit.archiveMaterials.backend.api.domain.entity;

import cz.vut.fit.archiveMaterials.backend.api.domain.bridges.TypeOfRecordValueBridge;
import cz.vut.fit.archiveMaterials.backend.api.domain.converters.ArchivalRecordTypeEnumConverter;
import cz.vut.fit.archiveMaterials.backend.api.domain.embeddable.*;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;

import java.util.List;
import lombok.Data;
import org.hibernate.search.engine.backend.types.Aggregable;
import org.hibernate.search.engine.backend.types.Searchable;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.bridge.mapping.annotation.ValueBridgeRef;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.*;

/**
 * Represents an archival record entity with detailed information about the record.
 *
 * <p>The class is annotated with Lombok's {@code @Data} to automatically generate
 * boilerplate code for getters, setters, equals, hashCode, and toString methods.</p>
 *
 * <p>The class is annotated with JPA's {@code @Entity} to indicate it's an entity that
 * will be mapped to a database table. It is also annotated with Hibernate Search's {@code @Indexed}
 * to enable indexing for search capabilities.</p>
 *
 * <p>The class defines various fields, including embedded objects, collections, and
 * specific annotations like {@code @KeywordField} and {@code @FullTextField} for Hibernate Search
 * integration. It uses custom converters and bridges for certain fields.</p>
 *
 * <p>For each field, appropriate Javadoc comments are provided to describe its purpose and usage.</p>
 */
@Data
@Entity
@Indexed
@Table(
        name = "archival_record",
        indexes = {
                @Index(name = "idx_link", columnList = "link", unique = true)
        }
)
public class ArchivalRecord {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "type_of_record")
    @Enumerated(EnumType.STRING)
    @KeywordField(
            //normalizer = "czech",
            valueBridge = @ValueBridgeRef(type = TypeOfRecordValueBridge.class),
            aggregable = Aggregable.YES
    )
    @Convert(converter = ArchivalRecordTypeEnumConverter.class)
    private ArchivalRecordTypeEnum typeOfRecord;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "archive_id")
    @IndexedEmbedded(includePaths = {Archive_.NAME, Archive_.ADDRESS, Archive_.ABBREVIATION})
    private Archive archive;


    @Column(name = "signature")
    @KeywordField(normalizer = "czech", sortable = Sortable.YES)
    private String signature;

    @Column(name = "nad")
    private Integer nad;

    @Column(name = "inventory_number")
    @KeywordField(normalizer = "czech", sortable = Sortable.YES)
    private String inventoryNumber;


    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
    @JoinTable(
            name = "archivalRecord_languages",
            joinColumns = @JoinColumn(name = "archival_record_id"),
            inverseJoinColumns = @JoinColumn(name = "language_id")
    )
    @IndexedEmbedded(includePaths = { Language_.NAME })
    private Collection<Language> languages = new ArrayList<>();

    @Column(name = "number_of_scans")
    private Integer numberOfScans;

    @Column(name = "other_note", length = 4096, columnDefinition = "TEXT")
    @FullTextField(analyzer = "czech")
    private String otherNote;

    @Column(name = "link")
    private String link;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.REMOVE, CascadeType.PERSIST})
    @JoinTable(
            name = "archivalRecord_locations",
            joinColumns = @JoinColumn(name = "archival_record_id"),
            inverseJoinColumns = @JoinColumn(name = "location_id")
    )
    @IndexedEmbedded(includePaths = { Location_.COUNTRY, Location_.REGION, Location_.DISTRICT, "municipality_keyword", "municipality_full_text", Location_.BOROUGH  })
    private Collection<Location> locations = new ArrayList<>();

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "from", column = @Column(name = "year_from")),
            @AttributeOverride(name = "to", column = @Column(name = "year_to"))
    })
    @IndexedEmbedded
    private TimeRange year;

    @Column(name = "content", length = 4096, columnDefinition = "TEXT")
    @FullTextField(analyzer = "czech")
    private String content;

    @Column(name = "description", length = 4096, columnDefinition = "TEXT")
    @FullTextField(analyzer = "czech")
    private String description;

    @OneToMany(mappedBy = "archivalRecord", cascade = {CascadeType.REMOVE, CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    private Collection<Scan> scans = new ArrayList<>();

    @Column(name = "digitalized")
    @GenericField(searchable = Searchable.YES)
    private boolean digitalized;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "type", column = @Column(name = "originator_type")),
            @AttributeOverride(name = "name", column = @Column(name = "originator_name")),
            @AttributeOverride(name = "note", column = @Column(name = "originator_note", length = 1024)),
    })
    @IndexedEmbedded(includePaths = {Originator_.TYPE, Originator_.NAME, Originator_.NOTE})
    private Originator originator;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "name", column = @Column(name = "fund_name")),
            @AttributeOverride(name = "code", column = @Column(name = "fund_code")),
    })
    @IndexedEmbedded(includePaths = {Fund_.NAME, Fund_.CODE})
    private Fund fund;


    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "from", column = @Column(name = "year_born_from")),
            @AttributeOverride(name = "to", column = @Column(name = "year_born_to"))
    })
    @IndexedEmbedded
    private TimeRange yearBorn;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "from", column = @Column(name = "year_born_index_from")),
            @AttributeOverride(name = "to", column = @Column(name = "year_born_index_to"))
    })
    @IndexedEmbedded
    private TimeRange yearBornIndex;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "from", column = @Column(name = "year_married_from")),
            @AttributeOverride(name = "to", column = @Column(name = "year_married_to"))
    })
    @IndexedEmbedded
    private TimeRange yearMarried;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "from", column = @Column(name = "year_married_index_from")),
            @AttributeOverride(name = "to", column = @Column(name = "year_married_index_to"))
    })
    @IndexedEmbedded
    private TimeRange yearMarriedIndex;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "from", column = @Column(name = "year_deceased_from")),
            @AttributeOverride(name = "to", column = @Column(name = "year_deceased_to"))
    })
    @IndexedEmbedded
    private TimeRange yearDeceased;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "from", column = @Column(name = "year_deceased_index_from")),
            @AttributeOverride(name = "to", column = @Column(name = "year_deceased_index_to"))
    })
    @IndexedEmbedded
    private TimeRange yearDeceasedIndex;

    @Column(name = "register_note", length = 4096, columnDefinition = "TEXT")
    @FullTextField(analyzer = "czech")
    private String registerNote;

    @Column(name = "year_taken")
    @GenericField(searchable = Searchable.YES, sortable = Sortable.YES)
    private Integer yearTaken;

    @Column(name = "judicial_district")
    @FullTextField(analyzer = "czech")
    private String judicialDistrict;

    @Column(name = "land_registry_nrs", length = 4096, columnDefinition = "TEXT")
    @FullTextField(analyzer = "czech")
    private String landRegistryNrs;

    @Column(name = "index_only")
    private boolean indexOnly;

    @Column(name = "specific_type")
    @FullTextField(analyzer = "czech")
    private String specificType;

    @Column(name = "record_method")
    @FullTextField(analyzer = "czech")
    private String recordMethod;

    @Column(name = "original_name", length = 4096, columnDefinition = "TEXT")
    @FullTextField(analyzer = "czech")
    private String originalName;

    @Column(name = "name")
    @FullTextField(analyzer = "czech")
    private String name;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "archivalRecord")
    @IndexedEmbedded(includePaths = { Note_.USER + "." + User_.EMAIL })
    private Collection<Note> notes;


    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.REMOVE})
    @JoinTable(
            name = "favourite_archival_record",
            joinColumns = @JoinColumn(name = "archival_record_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @IndexedEmbedded(includePaths = { User_.EMAIL })
    private Collection<User> favouritesByUsers = new ArrayList<>();

    @OneToMany(mappedBy = "archivalRecord", cascade = {CascadeType.REMOVE}, fetch = FetchType.LAZY)
    @IndexedEmbedded(includePaths = { Bookmark_.USER + "." + User_.EMAIL })
    private List<Bookmark> bookmarks = new ArrayList<>();

}

