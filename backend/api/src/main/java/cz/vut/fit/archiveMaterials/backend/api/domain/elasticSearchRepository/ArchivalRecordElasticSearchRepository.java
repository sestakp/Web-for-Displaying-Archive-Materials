package cz.vut.fit.archiveMaterials.backend.api.domain.elasticSearchRepository;

import cz.vut.fit.archiveMaterials.backend.api.domain.elasticSearchRepository.specs.ArchivalRecordElasticSpecs;
import cz.vut.fit.archiveMaterials.backend.api.domain.embeddable.TimeRange_;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord_;
import cz.vut.fit.archiveMaterials.backend.api.domain.dto.ArchivalRecordPage;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import cz.vut.fit.archiveMaterials.backend.api.dto.CountsByMunicipalityDto;
import jakarta.persistence.EntityManager;
import org.hibernate.Session;
import org.hibernate.search.engine.search.aggregation.AggregationKey;
import org.hibernate.search.engine.search.sort.dsl.SortOrder;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.stereotype.Repository;

import java.util.Map;


/**
 * Repository class for performing full-text search on ArchivalRecord entities using Elasticsearch.
 * This repository utilizes Hibernate Search for integration with Elasticsearch.
 * <p>
 * To use this repository, create an instance and invoke the {@link #fullTextSearch(Integer pageSize, Integer page, ArchivalRecordTypeEnum typeOfRecord, String q, String archiveAbbr, Integer yearFrom, Integer yearTo, String country, String region, String district, String municipality, String borough, String email, boolean onlyWithMyNotes, boolean onlyWithMyBookmarks, boolean onlyDigitalized, String sortField, Integer sortOrder)} method
 * with the desired search criteria.
 * </p>
 *
 * For more information, visit the official documentation at <a href="https://docs.jboss.org/hibernate/stable/search/reference/en-US/html_single/">Hibernate Search Documentation</a>.
 *
 * @see ArchivalRecordElasticSpecs
 * @see ArchivalRecord
 * @see ArchivalRecordPage
 */
@Repository
public class ArchivalRecordElasticSearchRepository {

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
    public ArchivalRecordElasticSearchRepository(EntityManager entityManager) {

        this.entityManager = entityManager;
        this.searchSession =  Search.session(entityManager.unwrap(Session.class));
    }

    public ArchivalRecordPage fullTextSearch(Integer pageSize, Integer page, ArchivalRecordTypeEnum typeOfRecord, String q, String archiveAbbr, Integer yearFrom, Integer yearTo, String country, String region, String district, String municipality, String borough, String email,boolean onlyWithMyNotes, boolean onlyWithMyBookmarks, boolean onlyDigitalized,String sortField, Integer sortOrder) {

        page = page != null ? page : 0;
        pageSize = pageSize != null ? pageSize : 10;

        var offSet = page * pageSize;


        var searchPredicate = searchSession.search(ArchivalRecord.class)
                .where(f -> 
                        ArchivalRecordElasticSpecs
                                .getFullTextSearchPredicate(archiveAbbr, typeOfRecord, q, yearFrom, yearTo,country, region, district, municipality, borough, email, onlyWithMyNotes, onlyWithMyBookmarks,onlyDigitalized, f)
                );

        if(sortField != null){
            searchPredicate = searchPredicate.sort( f -> f.field(sortField).order(sortOrder == 1 ? SortOrder.ASC : SortOrder.DESC));
        }

        var searchResult = searchPredicate.sort( f -> f


                        .field(ArchivalRecord_.YEAR_TAKEN).asc()
                        .then().field(ArchivalRecord_.YEAR + "." + TimeRange_.FROM).asc()
                        //.then().field(ArchivalRecord_.YEAR + "." + TimeRange_.TO).asc()


                        //.then().field(ArchivalRecord_.YEAR_BORN + "." + TimeRange_.FROM).asc()
                        //.then().field(ArchivalRecord_.YEAR_BORN + "." + TimeRange_.TO).asc()

                        //.then().field(ArchivalRecord_.YEAR_BORN_INDEX + "." + TimeRange_.FROM).asc()
                        //.then().field(ArchivalRecord_.YEAR_BORN_INDEX + "." + TimeRange_.TO).asc()

                        //.then().field(ArchivalRecord_.YEAR_MARRIED + "." + TimeRange_.FROM).asc()
                        //.then().field(ArchivalRecord_.YEAR_MARRIED + "." + TimeRange_.TO).asc()

                        //.then().field(ArchivalRecord_.YEAR_MARRIED_INDEX + "." + TimeRange_.FROM).asc()
                        //.then().field(ArchivalRecord_.YEAR_MARRIED_INDEX + "." + TimeRange_.TO).asc()

                        //.then().field(ArchivalRecord_.YEAR_DECEASED + "." + TimeRange_.FROM).asc()
                        //.then().field(ArchivalRecord_.YEAR_DECEASED + "." + TimeRange_.TO).asc()

                        //.then().field(ArchivalRecord_.YEAR_DECEASED_INDEX + "." + TimeRange_.FROM).asc()
                        //.then().field(ArchivalRecord_.YEAR_DECEASED_INDEX + "." + TimeRange_.TO).asc()
                )
                .fetch(offSet, pageSize);

        return new ArchivalRecordPage(searchResult.hits(), pageSize, searchResult.total().hitCount());
    }

    public CountsByMunicipalityDto GetCountsByMunicipality(String country, String region, String district, String municipality, String borough){
        var result = new CountsByMunicipalityDto();

       var matrikyCount = searchSession.search(ArchivalRecord.class)
                .where(f ->
                        ArchivalRecordElasticSpecs
                                .getFullTextSearchPredicate(null, ArchivalRecordTypeEnum.MATRIKA, null, null, null,country, region, district, municipality, borough, null, false, false,false, f)
                )
               .fetchTotalHitCount();
       result.setMatriky(matrikyCount);

        var rektifikacniAktaCount = searchSession.search(ArchivalRecord.class)
                .where(f ->
                        ArchivalRecordElasticSpecs
                                .getFullTextSearchPredicate(null, ArchivalRecordTypeEnum.REKTIFIKACNI_AKTA, null, null, null,country, region, district, municipality, borough, null, false, false,false, f)
                )
                .fetchTotalHitCount();
        result.setRetrifikacniAkta(rektifikacniAktaCount);

        var lanoveRejstrikyCount = searchSession.search(ArchivalRecord.class)
                .where(f ->
                        ArchivalRecordElasticSpecs
                                .getFullTextSearchPredicate(null, ArchivalRecordTypeEnum.LANOVY_REJSTRIK, null, null, null,country, region, district, municipality, borough, null, false, false,false, f)
                )
                .fetchTotalHitCount();
        result.setLanoveRejstriky(lanoveRejstrikyCount);

        var urbareCount = searchSession.search(ArchivalRecord.class)
                .where(f ->
                        ArchivalRecordElasticSpecs
                                .getFullTextSearchPredicate(null, ArchivalRecordTypeEnum.URBAR, null, null, null,country, region, district, municipality, borough, null, false, false,false, f)
                )
                .fetchTotalHitCount();
        result.setUrbare(urbareCount);

        var pozemkovaKnihaCount = searchSession.search(ArchivalRecord.class)
                .where(f ->
                        ArchivalRecordElasticSpecs
                                .getFullTextSearchPredicate(null, ArchivalRecordTypeEnum.POZEMKOVA_KNIHA, null, null, null,country, region, district, municipality, borough, null, false, false,false, f)
                )
                .fetchTotalHitCount();
        result.setPozemkoveKnihy(pozemkovaKnihaCount);

        var scitaciOperatyCount = searchSession.search(ArchivalRecord.class)
                .where(f ->
                        ArchivalRecordElasticSpecs
                                .getFullTextSearchPredicate(null, ArchivalRecordTypeEnum.SCITACI_OPERATOR, null, null, null,country, region, district, municipality, borough, null, false, false,false, f)
                )
                .fetchTotalHitCount();
        result.setScitaciOperatory(scitaciOperatyCount);

        return result;
    }
    
}
