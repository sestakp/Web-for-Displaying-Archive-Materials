package cz.vut.fit.archiveMaterials.backend.api.service;

import cz.vut.fit.archiveMaterials.backend.api.domain.dto.LocationPage;
import cz.vut.fit.archiveMaterials.backend.api.domain.elasticSearchRepository.LocationElasticSearchRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationElasticSearchRepository locationElasticSearchRepository;

    /**
     * Searches for locations based on the provided criteria.
     *
     * @param numberOfResults The maximum number of results to return.
     * @param country         The country to search in.
     * @param region          The region to search in.
     * @param district        The district to search in.
     * @param municipality    The municipality to search in.
     * @param borough         The borough to search in.
     * @param q               The query string for full-text search.
     * @return A page of locations matching the search criteria.
     */
    @Transactional(readOnly = true)
    public LocationPage searchLocations(Integer numberOfResults, String country, String region, String district,
            String municipality, String borough, String q) {
        log.info("Searching for locations {} {} {} {} {} {}", country, region, district, municipality, borough, q);
        return locationElasticSearchRepository.fullTextSearch(numberOfResults, country, region, district, municipality,
                borough, q);
    }

    /**
     * Searches for districts based on the provided criteria.
     *
     * @param numberOfResults The maximum number of results to return.
     * @param district        The district to search for.
     * @param region          The region to search in.
     * @return A list of districts matching the search criteria.
     */
    @Transactional(readOnly = true)
    public List<String> searchDistrict(Integer numberOfResults, String district, String region) {
        log.info("Searching for district {} and region {}", district, region);
        return locationElasticSearchRepository.searchDistrict(numberOfResults, district, region);

    }

    /**
     * Searches for regions based on the provided criteria.
     *
     * @param numberOfResults The maximum number of results to return.
     * @param region          The region to search for.
     * @return A list of regions matching the search criteria.
     */
    @Transactional(readOnly = true)
    public List<String> searchRegion(Integer numberOfResults, String region) {
        log.info("Searching for region {}", region);
        return locationElasticSearchRepository.searchRegion(numberOfResults, region);
    }
}
