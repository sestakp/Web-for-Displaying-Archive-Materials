package cz.vut.fit.archiveMaterials.backend.api.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import lombok.Data;
import org.hibernate.search.engine.backend.types.Aggregable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.*;

@Data
@Entity
@Indexed
@Table(name = "location", indexes = {

        @Index(name = "idx_location", columnList = "country, region, district, municipality, borough"),
        @Index(name = "idx_region", columnList = "region"),
        @Index(name = "idx_country", columnList = "country"),
        @Index(name = "idx_district", columnList = "district")
},
        uniqueConstraints = {
                @UniqueConstraint( //handle race conditions on inserting same location
                        name = "unique_location_fields",
                        columnNames = {"country", "region", "district", "municipality", "borough", "latitude", "longitude"}
                )
})
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @Column(name = "country", length = 50)
    @KeywordField(normalizer = "czech")
    private String country;

    @Column(name = "region", length = 50)
    @KeywordField(normalizer = "czech", aggregable = Aggregable.YES)
    private String region;

    @Column(name = "district", length = 50)
    @KeywordField(normalizer = "czech", aggregable = Aggregable.YES)
    private String district;


    @Column(name = "municipality", length = 100)
    @KeywordField(normalizer = "czech", name = "municipality_keyword")
    @FullTextField(analyzer = "czech", name = "municipality_full_text")
    private String municipality;

    @Column(name = "borough", length = 50)
    @KeywordField(normalizer = "czech")
    private String borough;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> alternativeNames = new ArrayList<>();


    @ManyToMany(mappedBy = ArchivalRecord_.LOCATIONS)
    @JsonIgnore
    private Collection<ArchivalRecord> archivalRecords = new ArrayList<>();


    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Location that = (Location) o;
        return Objects.equals(country, that.country) &&
                Objects.equals(region, that.region) &&
                Objects.equals(district, that.district) &&
                Objects.equals(municipality, that.municipality) &&
                Objects.equals(borough, that.borough) &&
                Objects.equals(latitude, that.latitude) &&
                Objects.equals(longitude, that.longitude);
    }

    @Override
    public int hashCode() {
        return Objects.hash(country, region, district, municipality, borough, latitude,
                longitude);
    }
}
