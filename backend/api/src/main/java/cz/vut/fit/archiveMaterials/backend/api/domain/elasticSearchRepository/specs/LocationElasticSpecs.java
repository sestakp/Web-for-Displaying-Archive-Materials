package cz.vut.fit.archiveMaterials.backend.api.domain.elasticSearchRepository.specs;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord_;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive_;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location_;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import org.hibernate.search.engine.search.predicate.dsl.BooleanPredicateClausesStep;
import org.hibernate.search.engine.search.predicate.dsl.MatchPredicateOptionsStep;
import org.hibernate.search.engine.search.predicate.dsl.SearchPredicateFactory;
import org.hibernate.search.engine.search.predicate.dsl.WildcardPredicateOptionsStep;

/**
 * Utility class for constructing Elasticsearch search predicates related to locations.
 */
public class LocationElasticSpecs {


    public static BooleanPredicateClausesStep<?> getFullTextSearchPredicate(String country, String region,String district, String municipality, String borough, String q, SearchPredicateFactory f) {
        BooleanPredicateClausesStep<?> booleanQuery = f.bool()
                .must(t -> LocationElasticSpecs.matchCountry(t, country))
                .must(t -> LocationElasticSpecs.matchRegion(t, region))
                .must(t -> LocationElasticSpecs.matchDistrict(t, district))
                .must(t -> LocationElasticSpecs.matchMunicipality(t, municipality))
                .must(t -> LocationElasticSpecs.matchBorough(t, borough));

        if (q != null && !q.isBlank()) {
            var substrings = q.split("[,;]+");
            for (var substring : substrings) {
                booleanQuery.must(t -> LocationElasticSpecs.matchAllFields(t, substring.trim().toLowerCase()));
            }
        }
        return booleanQuery;
    }

    private static BooleanPredicateClausesStep<?> matchCountry(SearchPredicateFactory f, String country) {
        return f.bool()
                .should(b -> {
                    if (country != null && ! country.isBlank()) {
                        return b.wildcard()
                                .field(Location_.COUNTRY)
                                .matching(country + "*");
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchRegion(SearchPredicateFactory f, String region) {
        return f.bool()
                .should(b -> {
                    if (region != null && ! region.isBlank()) {
                        return b.wildcard()
                                .field(Location_.REGION)
                                .matching(region + "*");
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchDistrict(SearchPredicateFactory f, String district) {
        return f.bool()
                .should(b -> {
                    if (district != null && ! district.isBlank()) {
                        return b.wildcard()
                                .field(Location_.DISTRICT)
                                .matching(district + "*");
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchMunicipality(SearchPredicateFactory f, String municipality) {


        return f.bool()
                .should(b -> {
                    if (municipality != null && ! municipality.isBlank()) {
                        return b.wildcard()
                                .fields("municipality_keyword", "municipality_full_text")
                                .matching(municipality + "*");
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchBorough(SearchPredicateFactory f, String borough) {
        return f.bool()
                .should(b -> {
                    if (borough != null && ! borough.isBlank()) {
                        return b.wildcard()
                                .field(Location_.BOROUGH)
                                .matching(borough + "*");
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchAllFields(SearchPredicateFactory f, String q) {


        return f.bool()
                .should(b -> b.wildcard()
                        .fields(
                                Location_.COUNTRY,
                                Location_.REGION,
                                Location_.DISTRICT
                        )
                        .matching(q + "*")
                )
                .should(b -> b.wildcard()
                        .fields("municipality_keyword", "municipality_full_text").boost(2.0f)
                        .matching(q + "*")
                )
                .should(b -> b.wildcard()
                        .field(Location_.BOROUGH).boost(2.0f)
                        .matching(q + "*")
                );
    }
}
