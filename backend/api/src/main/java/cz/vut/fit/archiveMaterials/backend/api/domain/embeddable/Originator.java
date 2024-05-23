package cz.vut.fit.archiveMaterials.backend.api.domain.embeddable;

import jakarta.persistence.Embeddable;
import lombok.Data;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

/**
 * Represents information about the originator associated with an archival record.
 *
 * <p>The class is annotated with Lombok's {@code @Data} to automatically generate
 * boilerplate code for getters, setters, equals, hashCode, and toString methods.</p>
 *
 * <p>The class is annotated with JPA's {@code @Embeddable}, indicating that it can be
 * embedded into other entities.</p>
 */
@Data
@Embeddable
public class Originator {

    /**
     * The type of the originator, e.g., rimskokatolicka cirkev.
     */
    @KeywordField(normalizer = "czech")
    private String type;

    /**
     * Additional notes or details about the originator.
     */
    @FullTextField(analyzer = "czech")
    private String note;

    /**
     * The name of the originator.
     */
    @KeywordField(normalizer = "czech", sortable = Sortable.YES)
    private String name;
}
