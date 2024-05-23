package cz.vut.fit.archiveMaterials.backend.api.controller;

import cz.vut.fit.archiveMaterials.backend.api.LocationsControllerApi;
import cz.vut.fit.archiveMaterials.backend.api.controller.mapper.LocationDtoMapper;
import cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService.LocationPersistenceService;
import cz.vut.fit.archiveMaterials.backend.api.dto.CountryDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.LocationPageDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.RegionDto;
import cz.vut.fit.archiveMaterials.backend.api.service.LocationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller class for searching locations
 */
@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LocationController implements LocationsControllerApi {

    private final LocationService locationService;
    private final LocationPersistenceService locationPersistenceService;
    private final LocationDtoMapper mapper;

    /**
     * Searches locations based on the specified criteria.
     *
     * @param numberOfResults The number of results to return.
     * @param country         The name of the country.
     * @param region          The name of the region.
     * @param district        The name of the district.
     * @param municipality    The name of the municipality.
     * @param borough         The name of the borough.
     * @param q               The search query.
     * @return A ResponseEntity containing a LocationPageDto object with the search results.
     */
    @Override
    public ResponseEntity<LocationPageDto> searchLocations(@Valid Integer numberOfResults, @Valid String country,
            @Valid String region, @Valid String district, @Valid String municipality, @Valid String borough,
            @Valid String q) {
        var locationPage = locationService.searchLocations(numberOfResults, country, region, district, municipality,
                borough, q);
        var dto = mapper.map(locationPage);
        return ResponseEntity.ok(dto);
    }

    /**
     * Retrieves the list of countries.
     *
     * @return A ResponseEntity containing a list of country names.
     */
    @Override
    public ResponseEntity<List<String>> getCountries() {
        var countries = locationPersistenceService.getCountries();
        return ResponseEntity.ok(countries);
    }

    /**
     * Retrieves the list of districts for the specified country and region.
     *
     * @param country The name of the country.
     * @param region  The name of the region.
     * @return A ResponseEntity containing a list of DistrictDto objects.
     */
    @Override
    public ResponseEntity<List<RegionDto>> getDistricts(@Valid String country, @Valid String region) {
        var districts = locationPersistenceService.getDistricts(country, region);
        return ResponseEntity.ok(districts);
    }

    /**
     * Retrieves the list of regions for the specified country.
     *
     * @param country The name of the country.
     * @return A ResponseEntity containing a list of RegionDto objects.
     */
    @Override
    public ResponseEntity<List<CountryDto>> getRegions(@Valid String country) {
        var regions = locationPersistenceService.getRegions(country);
        return ResponseEntity.ok(regions);
    }
}
