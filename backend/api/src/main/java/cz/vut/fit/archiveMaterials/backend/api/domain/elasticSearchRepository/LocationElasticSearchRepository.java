package cz.vut.fit.archiveMaterials.backend.api.domain.elasticSearchRepository;

import cz.vut.fit.archiveMaterials.backend.api.domain.elasticSearchRepository.specs.LocationElasticSpecs;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location;
import cz.vut.fit.archiveMaterials.backend.api.domain.dto.LocationPage;
import jakarta.persistence.EntityManager;
import org.hibernate.Session;
import org.hibernate.search.engine.search.aggregation.AggregationKey;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class LocationElasticSearchRepository {
    /**
     * The JPA entity manager for database interaction.
     */
    private final EntityManager entityManager;

    /**
     * The Hibernate Search session for performing Elasticsearch searches.
     */
    private final SearchSession searchSession;

    /**
     * Constructs an instance of the ArchivalRecordElasticSearchRepository.
     *
     * @param entityManager The JPA entity manager.
     */
    public LocationElasticSearchRepository(EntityManager entityManager) {

        this.entityManager = entityManager;
        this.searchSession =  Search.session(entityManager.unwrap(Session.class));
    }


    /**
     * Performs a full-text search on Location entities based on the provided criteria.
     *
     * @return An {@link LocationPage} containing the search results.
     */
    public LocationPage fullTextSearch(Integer numberOfResults, String country, String region, String district, String municipality, String borough, String q) {

        numberOfResults = numberOfResults != null ?numberOfResults : 10;


        var searchResult = searchSession.search(Location.class)
                .where(f ->
                        LocationElasticSpecs
                                .getFullTextSearchPredicate(country,region, district, municipality, borough, q, f))
                .fetch(numberOfResults);

        return new LocationPage(searchResult.hits(), numberOfResults, searchResult.total().hitCount());
    }


    public List<String> searchDistrict(Integer numberOfResults, String district, String region){

        Integer finalNumberOfResults = numberOfResults != null ?numberOfResults : 10;

        AggregationKey<Map<String, Long>> districtKey = AggregationKey.of( "district" );

        var searchResult = searchSession.search(Location.class)
                .where(f ->
                        LocationElasticSpecs
                                .getFullTextSearchPredicate(null,region, district, null, null, null, f)
                )
                .aggregation(districtKey, f -> f.terms()
                        .field("district", String.class)
                        .maxTermCount(finalNumberOfResults)
                )
                .fetch(numberOfResults);

        return searchResult.aggregation(districtKey).keySet().stream().toList();

    }

    public List<String> searchRegion(Integer numberOfResults, String region){

        Integer finalNumberOfResults = numberOfResults != null ?numberOfResults : 10;

        AggregationKey<Map<String, Long>> districtKey = AggregationKey.of( "region" );

        var searchResult = searchSession.search(Location.class)
                .where(f ->
                        LocationElasticSpecs
                                .getFullTextSearchPredicate(null,region, null, null, null, null, f)
                )
                .aggregation(districtKey, f -> f.terms()
                        .field("region", String.class)
                        .maxTermCount(finalNumberOfResults)
                )
                .fetch(numberOfResults);

        return searchResult.aggregation(districtKey).keySet().stream().toList();

    }
}
