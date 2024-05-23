package cz.vut.fit.archiveMaterials.backend.api.domain.repository;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Repository interface for managing {@link Location} entities.
 *
 * <p>This interface extends {@link JpaRepository} to provide basic CRUD operations for the {@link Location} entity.</p>
 */
public interface LocationRepository extends JpaRepository<Location, Long> {

    /**
     * Finds a location by matching the specified attributes.
     *
     * <p>This method searches for a location with the provided attributes, including country, region, district, municipality,
     * borough, latitude, and longitude.</p>
     *
     * @param country The country of the location.
     * @param region The region of the location.
     * @param district The district of the location.
     * @param municipality The municipality of the location.
     * @param borough The borough of the location.
     * @param latitude The latitude of the location.
     * @param longitude The longitude of the location.
     * @return An {@link Optional} containing the location matching the specified attributes, or an empty {@link Optional}
     * if no match is found.
     */
    Optional<Location> findByCountryAndRegionAndDistrictAndMunicipalityAndBoroughAndLatitudeAndLongitude(
            String country, String region, String district, String municipality, String borough, Double latitude, Double longitude);

    @Query("SELECT DISTINCT l.region FROM Location l WHERE l.country = :country AND l.region IS NOT NULL")
    List<String> findAllUniqueRegionsByCountry(String country);

    @Query("SELECT DISTINCT l.country FROM Location l WHERE l.country IS NOT NULL")
    List<String> findAllUniqueCountries();


    @Query("SELECT DISTINCT l.region FROM Location l WHERE l.region IS NOT NULL")
    List<String> findAllUniqueRegions();

    @Query("SELECT DISTINCT l.district FROM Location l WHERE l.region = :region AND l.district IS NOT NULL")
    List<String> findAllDistrictsByRegion(String region);


    List<Location> findAllByCountryAndRegionAndDistrictAndMunicipalityAndBorough(
            String country, String region, String district, String municipality, String borough);


    List<Location> findAllByCountryIgnoreCaseOrRegionIgnoreCaseOrDistrictIgnoreCaseOrMunicipalityIgnoreCaseOrBoroughIgnoreCase(
            String country, String region, String district, String municipality, String borough
    );

}
