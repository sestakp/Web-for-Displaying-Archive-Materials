package cz.vut.fit.archiveMaterials.backend.api.domain.embeddable;

import jakarta.persistence.Embeddable;
import lombok.Data;
import org.hibernate.search.engine.backend.types.Searchable;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;

/**
 * Represents a time range with a starting point ({@code from}) and an ending point ({@code to}).
 *
 * <p>The class is annotated with Lombok's {@code @Data} to automatically generate
 * boilerplate code for getters, setters, equals, hashCode, and toString methods.</p>
 *
 * <p>The class is annotated with JPA's {@code @Embeddable}, indicating that it can be
 * embedded into other entities.</p>
 */
@Data
@Embeddable
public class TimeRange {
    /**
     * The starting point of the time range.
     */
    @GenericField(searchable = Searchable.YES, sortable = Sortable.YES)
    private Integer from;

    /**
     * The ending point of the time range.
     */

    @GenericField(searchable = Searchable.YES, sortable = Sortable.YES)
    private Integer to;

}
