package cz.vut.fit.archiveMaterials.backend.api.controller.mapper;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location;
import cz.vut.fit.archiveMaterials.backend.api.domain.dto.LocationPage;
import cz.vut.fit.archiveMaterials.backend.api.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class LocationDtoMapper {


    @Mapping(target = "content", source = "content", qualifiedByName = "mapListOfLocationLists")
    public abstract LocationPageDto map(LocationPage page);


    public abstract LocationListDto mapToList(Location location);
    public abstract LocationDto map(Location location);

    @Named("mapListOfLocationLists")
    public List<LocationListDto> mapListOfLocationLists(List<Location> locations) {

        var listDtos = new ArrayList<LocationListDto>();

        if (locations != null)
        {
            for (var loc : locations) {
                listDtos.add(mapToList(loc));
            }
        }
        return listDtos;
    }

    @Named("mapCollectionOfLocationLists")
    public List<LocationListDto> mapListOfLocationLists(Collection<Location> locations) {

        var listDtos = new ArrayList<LocationListDto>();

        if (locations != null)
        {
            for (var loc : locations) {
                listDtos.add(mapToList(loc));
            }
        }
        return listDtos;
    }

    @Named("mapCollectionOfLocations")
    public List<LocationDto> mapListOfLocations(Collection<Location> locations) {

        var listDtos = new ArrayList<LocationDto>();

        if (locations != null)
        {
            for (var loc : locations) {
                listDtos.add(map(loc));
            }
        }
        return listDtos;
    }

    @Named("mapListOfLocations")
    public List<LocationDto> mapListOfLocations(List<Location> locations) {

        var listDtos = new ArrayList<LocationDto>();

        if (locations != null)
        {
            for (var loc : locations) {
                listDtos.add(map(loc));
            }
        }
        return listDtos;
    }
}
