package cz.vut.fit.archiveMaterials.backend.api.domain.repository.specs;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

/**
 * Specifications class for constructing Spring Data JPA specifications related to {@link ArchivalRecord}.
 *
 * <p>This class provides methods to create specifications for querying archival records based on various criteria.</p>
 */
public class ArchivalRecordSpecs {

    public static Specification<ArchivalRecord> baseSpecification() {
        return (root, query, criteriaBuilder) -> {
            // Add any common criteria here, e.g., filtering by active records
            return criteriaBuilder.conjunction();
        };
    }


    public static Specification<ArchivalRecord> archiveIdEquals(Long archiveId) {
        if (archiveId != null) {
            return ((root, query, criteriaBuilder) -> criteriaBuilder.or(
                    criteriaBuilder.equal(root.get("archive").get("id"), archiveId),
                    criteriaBuilder.isNull(root.get("archive").get("id"))
            ));
        }
        return null;
    }

    public static Specification<ArchivalRecord> recordTypeEquals(ArchivalRecordTypeEnum type) {
        if (type != null) {
            return ((root, query, criteriaBuilder) -> criteriaBuilder.or(
                    criteriaBuilder.equal(root.get("typeOfRecord"), type),
                    criteriaBuilder.isNull(root.get("typeOfRecord"))
            ));
        }
        return null;
    }


    public static Specification<ArchivalRecord> searchText(String search) {
        return (root, query, criteriaBuilder) -> {
            String[] searches = search.split(",");

            Predicate[] predicates = new Predicate[searches.length];

            for (int i = 0; i < searches.length; i++) {
                String currentSearch = searches[i].trim();
                predicates[i] = criteriaBuilder.or(
                        criteriaBuilder.like(root.get("otherNote"), "%" + currentSearch + "%"),
                        criteriaBuilder.like(root.join("locations").get("municipality"), "%" + currentSearch + "%")
                );
            }
            return criteriaBuilder.or(predicates);
        };
    }

}
