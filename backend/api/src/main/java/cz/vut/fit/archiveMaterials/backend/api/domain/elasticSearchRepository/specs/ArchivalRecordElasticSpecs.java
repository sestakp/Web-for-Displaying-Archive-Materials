package cz.vut.fit.archiveMaterials.backend.api.domain.elasticSearchRepository.specs;

import cz.vut.fit.archiveMaterials.backend.api.domain.embeddable.Fund_;
import cz.vut.fit.archiveMaterials.backend.api.domain.embeddable.Originator_;
import cz.vut.fit.archiveMaterials.backend.api.domain.embeddable.TimeRange_;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.*;
import cz.vut.fit.archiveMaterials.backend.api.dto.ArchivalRecordTypeEnum;
import org.aspectj.weaver.ast.Not;
import org.hibernate.search.engine.search.predicate.SearchPredicate;
import org.hibernate.search.engine.search.predicate.dsl.*;
import org.hibernate.search.engine.search.sort.dsl.SortFinalStep;

import java.awt.print.Book;
import java.util.function.Predicate;

/**
 * Utility class for constructing Elasticsearch search predicates related to archival records.
 */
public class ArchivalRecordElasticSpecs {

        /**
     * Constructs a boolean predicate for full-text search based on the specified criteria.
     *
     * @param archiveAbbr - The archive abbreviation
     * @param recordType - The type of archival record to match.
     * @param q - The search query.
     * @param f - The search predicate factory.
     * @return The boolean predicate for full-text search.
     */
    public static BooleanPredicateClausesStep<?> getFullTextSearchPredicate(String archiveAbbr, ArchivalRecordTypeEnum recordType, String q, Integer yearFrom, Integer yearTo, String country, String region, String district, String municipality, String borough, String email,boolean onlyWithMyNotes, boolean onlyWithMyBookmarks, boolean onlyDigitalized, SearchPredicateFactory f) {
        BooleanPredicateClausesStep<?> booleanQuery = f.bool()
                .must(t -> ArchivalRecordElasticSpecs.matchTypeOfRecord(t, recordType))
                .must(t -> ArchivalRecordElasticSpecs.matchArchiveAbbr(t, archiveAbbr))
                .must(t -> ArchivalRecordElasticSpecs.matchFavourites(t, email, onlyWithMyBookmarks, onlyWithMyNotes))
                .must(t -> ArchivalRecordElasticSpecs.matchWithMyBookmark(t, email, onlyWithMyBookmarks))
                .must(t -> ArchivalRecordElasticSpecs.matchWithMyNotes(t, email, onlyWithMyNotes))
                .must(t -> ArchivalRecordElasticSpecs.matchDigitalized(t, onlyDigitalized))
                .must(t -> ArchivalRecordElasticSpecs.matchCountry(t, country))
                .must(t -> ArchivalRecordElasticSpecs.matchRegion(t, region))
                .must(t -> ArchivalRecordElasticSpecs.matchDistrict(t, district))
                .must(t -> ArchivalRecordElasticSpecs.matchMunicipality(t, municipality))
                .must(t -> ArchivalRecordElasticSpecs.matchBorough(t, borough));


        /*if (yearFrom != null && yearTo != null) {

            booleanQuery = booleanQuery.must(t ->
                    t.bool()
                            .should(u -> ArchivalRecordElasticSpecs.matchYear(f, yearFrom))
                            .should(u -> ArchivalRecordElasticSpecs.matchYear(f, yearTo))
            );

            /*booleanQuery = booleanQuery
                    .should(t -> ArchivalRecordElasticSpecs.matchYear(f, yearFrom))
                    .should(t -> ArchivalRecordElasticSpecs.matchYear(f, yearTo));*/
        //} else {
            if (yearFrom != null) {
                booleanQuery = booleanQuery.must(t -> ArchivalRecordElasticSpecs.matchYearFrom(f, yearFrom));
            }

            if (yearTo != null) {
                booleanQuery = booleanQuery.must(t -> ArchivalRecordElasticSpecs.matchYearTo(f, yearTo));
            }
        //}


        if (q != null && !q.isBlank()) {
            var substrings = q.split("[,;\s]+");
            for (var substring : substrings) {
                booleanQuery.must(t -> ArchivalRecordElasticSpecs.matchAllFields(t, substring.trim()));
            }
        }

        return booleanQuery;
    }

    /**
     * Constructs a boolean predicate for matching all fields with the specified search text.
     *
     * @param f - The search predicate factory.
     * @param searchText - The search text.
     * @return The boolean predicate for matching all fields.
     */
    private static BooleanPredicateClausesStep<?> matchAllFields(SearchPredicateFactory f, String searchText) {

        return f.bool()
                //should
                .must(b -> {
                    if (searchText != null && ! searchText.isBlank()) {

                        return b.match()//.wildcard()
                                .fields(
                                        ArchivalRecord_.FUND + "." + Fund_.NAME,
                                        ArchivalRecord_.FUND + "." + Fund_.CODE,
                                        ArchivalRecord_.SIGNATURE,
                                        ArchivalRecord_.INVENTORY_NUMBER,
                                        ArchivalRecord_.OTHER_NOTE,
                                        ArchivalRecord_.LANGUAGES + "." + Language_.NAME,
                                        ArchivalRecord_.LOCATIONS + "." + Location_.COUNTRY,
                                        ArchivalRecord_.LOCATIONS + "." + Location_.DISTRICT,
                                        ArchivalRecord_.LOCATIONS + "." + Location_.REGION,
                                        ArchivalRecord_.LOCATIONS + "." + "municipality_keyword",
                                        ArchivalRecord_.LOCATIONS + "." + "municipality_full_text",
                                        ArchivalRecord_.LOCATIONS + "." + Location_.BOROUGH,
                                        ArchivalRecord_.CONTENT,
                                        ArchivalRecord_.DESCRIPTION,
                                        ArchivalRecord_.ORIGINATOR + "." + Originator_.TYPE,
                                        ArchivalRecord_.ORIGINATOR + "." + Originator_.NOTE,
                                        ArchivalRecord_.ORIGINATOR + "." + Originator_.NAME,
                                        ArchivalRecord_.REGISTER_NOTE,
                                        ArchivalRecord_.JUDICIAL_DISTRICT,
                                        ArchivalRecord_.LAND_REGISTRY_NRS,
                                        ArchivalRecord_.SPECIFIC_TYPE,
                                        ArchivalRecord_.RECORD_METHOD,
                                        ArchivalRecord_.ORIGINAL_NAME,
                                        ArchivalRecord_.NAME
                                        //ArchivalRecord_.ARCHIVE + "." + Archive_.NAME,
                                        //ArchivalRecord_.ARCHIVE + "." + Archive_.ADDRESS,
                                        //ArchivalRecord_.ARCHIVE + "." + Archive_.ABBREVIATION
                                )
                                .matching(/*"*"+searchText+"*"*/searchText);
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchWithMyBookmark(SearchPredicateFactory f, String email, boolean onlyWithBookmark) {
        return f.bool()
                //must
                .must(b -> {
                    if (onlyWithBookmark && email != null && ! email.isBlank()) {
                        return b.match()
                                .field(
                                        ArchivalRecord_.BOOKMARKS + "." + Bookmark_.USER + "." + User_.EMAIL
                                )
                                .matching(email);

                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchWithMyNotes(SearchPredicateFactory f, String email, boolean onlyWithNotes) {
        return f.bool()
                //should
                .must(b -> {
                    if (onlyWithNotes && email != null && ! email.isBlank()) {
                        return b.match()
                                .field(ArchivalRecord_.NOTES + "." + Note_.USER + "." + User_.EMAIL
                                )
                                .matching(email);
                    } else {
                        return b.matchAll();
                    }
                });
    }


    private static BooleanPredicateClausesStep<?> matchFavourites(SearchPredicateFactory f, String email, boolean onlyWithMyBookmarks, boolean onlyWithMyNotes) {
        return f.bool()
                //must
                .must(b -> {
                    if ( ! onlyWithMyBookmarks && ! onlyWithMyNotes && email != null && ! email.isBlank()) {

                        return b.match()
                                .field(
                                        ArchivalRecord_.FAVOURITES_BY_USERS + "." + User_.EMAIL
                                )
                                .matching(email);
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchDigitalized(SearchPredicateFactory f, boolean onlyDigitalized) {
        return f.bool()
                //must
                .must(b -> {
                    if ( onlyDigitalized) {

                        return b.match()
                                .field(
                                        ArchivalRecord_.DIGITALIZED
                                )
                                .matching(true);
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchCountry(SearchPredicateFactory f, String country) {

        return f.bool()
                //must
                .must(b -> {
                    if (country != null && ! country.isBlank()) {

                        return b.match()
                                .field(
                                        ArchivalRecord_.LOCATIONS + "." + Location_.COUNTRY
                                )
                                .matching(country);
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchRegion(SearchPredicateFactory f, String region) {

        return f.bool()
                //should
                .must(b -> {
                    if (region != null && ! region.isBlank()) {

                        return b.match()
                                .field(
                                        ArchivalRecord_.LOCATIONS + "." + Location_.REGION
                                )
                                .matching(region);
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchDistrict(SearchPredicateFactory f, String district) {

        return f.bool()
                //should
                .must(b -> {
                    if (district != null && ! district.isBlank()) {

                        return b.match()
                                .field(
                                        ArchivalRecord_.LOCATIONS + "." + Location_.DISTRICT
                                )
                                .matching(district);
                    } else {
                        return b.matchAll();
                    }
                });
    }

    private static BooleanPredicateClausesStep<?> matchMunicipality(SearchPredicateFactory f, String municipality) {


        return f.bool()
                //should
                .must(b -> {
                    if (municipality != null && ! municipality.isBlank()) {

                        return b.match()
                                .field(
                                        ArchivalRecord_.LOCATIONS + "." + "municipality_keyword"
                                )
                                .matching(municipality);
                    } else {
                        return b.matchAll();
                    }
                });
    }


    private static BooleanPredicateClausesStep<?> matchBorough(SearchPredicateFactory f, String borough) {

        return f.bool()
                //should
                .must(b -> {
                    if (borough != null && ! borough.isBlank()) {

                        return b.match()
                                .field(
                                        ArchivalRecord_.LOCATIONS + "." + Location_.BOROUGH
                                )
                                .matching(borough);
                    } else {
                        return b.matchAll();
                    }
                });
    }

    /**
     * Constructs a match predicate for the specified type of archival record.
     *
     * @param f - The search predicate factory.
     * @param typeOfRecord - The type of archival record to match.
     * @return The match predicate for the type of archival record.
     */
    private static PredicateFinalStep matchTypeOfRecord(SearchPredicateFactory f, ArchivalRecordTypeEnum typeOfRecord) {
        if (typeOfRecord == null) {
            return f.matchAll();
        }

        if(typeOfRecord == ArchivalRecordTypeEnum.VSE_BEZ_MATRIK){
            return f.bool()
                    .mustNot(b -> b.match()
                            .field(ArchivalRecord_.TYPE_OF_RECORD)
                            .matching(ArchivalRecordTypeEnum.MATRIKA)
                    );
        }

        return f.match()
                .field(ArchivalRecord_.TYPE_OF_RECORD)
                .matching(typeOfRecord);
    }


    /**
     * Constructs a boolean predicate for matching the archive ID.
     *
     * TODO... we can also match name, its easier for obtain
     *
     * @param f - The search predicate factory.
     * @param archiveAbbr - The archive abbr to match.
     * @return The boolean predicate for matching the archive ID.
     *
     */
    private static BooleanPredicateClausesStep<?> matchArchiveAbbr(SearchPredicateFactory f, String archiveAbbr) {
        return f.bool()
                //should
                .must(b -> {
                    if (archiveAbbr != null) {
                        if (archiveAbbr.isEmpty()){
                            return b.matchAll();
                        }
                        return b.match()
                                .field(ArchivalRecord_.ARCHIVE +"."+ Archive_.ABBREVIATION)
                                .matching(archiveAbbr);
                    } else {
                        return b.matchAll();
                    }
                });
    }



    private static RangePredicateOptionsStep<?> matchYearFrom(SearchPredicateFactory f, Integer yearFrom) {
        return f.range()
                .fields(
                        ArchivalRecord_.YEAR_TAKEN,
                        ArchivalRecord_.YEAR + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_BORN + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_DECEASED + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_MARRIED + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_BORN_INDEX + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_DECEASED_INDEX + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_MARRIED_INDEX + "." + TimeRange_.TO
                )
                .atLeast(yearFrom);
    }

    private static RangePredicateOptionsStep<?> matchYearTo(SearchPredicateFactory f, Integer yearTo) {
        return f.range()
                .fields(
                        ArchivalRecord_.YEAR_TAKEN,
                        ArchivalRecord_.YEAR + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_BORN + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_DECEASED + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_MARRIED + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_BORN_INDEX + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_DECEASED_INDEX + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_MARRIED_INDEX + "." + TimeRange_.FROM
                )
                .atMost(yearTo);
    }


    private static BooleanPredicateClausesStep<?> matchYear(SearchPredicateFactory f, Integer year) {
        RangePredicateOptionsStep<?> term1 = f.range()
                .fields(
                        ArchivalRecord_.YEAR + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_BORN + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_DECEASED + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_MARRIED + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_BORN_INDEX + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_DECEASED_INDEX + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_MARRIED_INDEX + "." + TimeRange_.FROM
                )
                .atMost(year);

        RangePredicateOptionsStep<?> term2 = f.range()
                .fields(
                        ArchivalRecord_.YEAR + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_BORN + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_DECEASED + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_MARRIED + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_BORN_INDEX + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_DECEASED_INDEX + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_MARRIED_INDEX + "." + TimeRange_.TO
                )
                .atLeast(year);

        return f.bool()
                .must(term1)
                .must(term2);
    }


   /* private static RangePredicateOptionsStep<?> matchYearInterval(SearchPredicateFactory f, Integer yearFrom, Integer yearTo){
        return f.range()
                .fields(
                        ArchivalRecord_.YEAR_TAKEN,
                        ArchivalRecord_.YEAR + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_BORN + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_DECEASED + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_MARRIED + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_BORN_INDEX + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_DECEASED_INDEX + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR_MARRIED_INDEX + "." + TimeRange_.FROM,
                        ArchivalRecord_.YEAR + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_BORN + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_DECEASED + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_MARRIED + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_BORN_INDEX + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_DECEASED_INDEX + "." + TimeRange_.TO,
                        ArchivalRecord_.YEAR_MARRIED_INDEX + "." + TimeRange_.TO
                )
                .between(yearFrom, yearTo);
    }*/



}
