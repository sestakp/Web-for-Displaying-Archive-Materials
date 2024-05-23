package cz.vut.fit.archiveMaterials.backend.api.domain.persistenceService;

import cz.vut.fit.archiveMaterials.backend.api.domain.repository.LocationRepository;

import cz.vut.fit.archiveMaterials.backend.api.dto.CountryDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.RegionDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service class for managing operations related to location persistence.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LocationPersistenceService {

    private final LocationRepository repository;

    /**
     * Retrieves a list of unique countries.
     *
     * @return A list of unique country names.
     */
    @Transactional(readOnly = true)
    public List<String> getCountries(){
        return repository.findAllUniqueCountries();
    }

    /**
     * Retrieves regions for a given country.
     *
     * @param country The name of the country.
     * @return A list of CountryDto objects containing regions.
     */
    @Transactional(readOnly = true)
    public List<CountryDto> getRegions(String country){

        var result = new ArrayList<CountryDto>();

        List<String> countries;

        if(country != null){
            countries = new ArrayList<>();
            countries.add(country);
        }
        else{
            countries = repository.findAllUniqueCountries();
        }

        for(var ctry : countries){
            var countryDto = new CountryDto();
            countryDto.setName(ctry);
            var regions = repository.findAllUniqueRegionsByCountry(ctry);
            countryDto.setRegions(regions);
            result.add(countryDto);
        }
        return result;
    }

    /**
     * Retrieves districts for a given country and region.
     *
     * @param country The name of the country.
     * @param region The name of the region.
     * @return A list of RegionDto objects containing districts.
     */
    @Transactional(readOnly = true)
    public List<RegionDto> getDistricts(String country, String region){

        var result = new ArrayList<RegionDto>();

        List<String> regions = new ArrayList<>();

        if(region != null){
            regions.add(region);
        }
        else if(country != null){
            regions = repository.findAllUniqueRegionsByCountry(country);
        }
        else{
            regions = repository.findAllUniqueRegions();
        }

        for(var rgion : regions){
            var regionDto = new RegionDto();
            regionDto.setName(rgion);

            var districts = repository.findAllDistrictsByRegion(rgion);
            regionDto.setDistricts(districts);
            result.add(regionDto);
        }
        return result;
    }
}
