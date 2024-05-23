package cz.vut.fit.archiveMaterials.backend.api.domain.embeddable;

import jakarta.persistence.Embeddable;
import lombok.Data;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

@Data
@Embeddable
public class Fund {

    @FullTextField(analyzer = "czech")
    public String name;

    @KeywordField
    public String code;
}
