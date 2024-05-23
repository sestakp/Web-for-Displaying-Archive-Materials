package cz.vut.fit.archiveMaterials.backend.api.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

@Data
@Entity
@Table(
        name = "language",
        indexes = {
                @Index(name = "idx_name", columnList = "name", unique = true)
        }
)
public class Language {

    public Language(){ }

    public Language(String name) { this.name = name; }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "name")
    @FullTextField(analyzer = "czech")
    private String name;


    @ManyToMany(mappedBy = ArchivalRecord_.LANGUAGES)
    @JsonIgnore
    private Collection<ArchivalRecord> archivalRecords = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Language that = (Language) o;

        return Objects.equals( name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
