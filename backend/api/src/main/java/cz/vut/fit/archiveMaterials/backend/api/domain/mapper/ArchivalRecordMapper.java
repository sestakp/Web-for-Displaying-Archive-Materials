package cz.vut.fit.archiveMaterials.backend.api.domain.mapper;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Language;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;


@Mapper(componentModel = "spring")
public interface ArchivalRecordMapper {


    @Mapping(target = "link", ignore = true)
    @Mapping(target = "languages", qualifiedByName = "mapLanguages")
    @Mapping(target = "locations", qualifiedByName = "mapLocations")
    @Mapping(target = "scans", qualifiedByName = "mapScans")
    void update(ArchivalRecord source, @MappingTarget ArchivalRecord target);





    @Named("mapLanguages")
    default Collection<Language> mapLanguages(Collection<Language> sourceLanguages) {
        return sourceLanguages != null ? new ArrayList<>(sourceLanguages) : new ArrayList<>();
    }

    @Named("mapLocations")
    default Collection<Location> mapLocations(Collection<Location> sourceLocations) {
        return sourceLocations != null ? new ArrayList<>(sourceLocations) : new ArrayList<>();
    }

    @Named("mapScans")
    default Collection<Scan> mapScans(Collection<Scan> sourceScans) {
        return sourceScans != null ? new ArrayList<>(sourceScans) : new ArrayList<>();
    }

}
