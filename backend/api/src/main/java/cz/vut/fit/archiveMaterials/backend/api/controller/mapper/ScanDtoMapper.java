package cz.vut.fit.archiveMaterials.backend.api.controller.mapper;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Language;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Location;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import cz.vut.fit.archiveMaterials.backend.api.dto.LocationDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.ScanDto;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class ScanDtoMapper {


    public abstract ScanDto mapToDto(Scan scan);

    public abstract Scan mapToEntity(ScanDto scan);

    @Named("mapScans")
    public Collection<Scan> mapScans(List<ScanDto> scans) {
        if (scans == null){
            return new ArrayList<>();
        }
        return scans.stream()
                .map(scan -> mapToEntity(scan))
                .collect(Collectors.toList());
    }

    @Named("mapScansRev")
    public List<ScanDto> mapScansRev(Collection<Scan> scans) {
        if (scans == null){
            return new ArrayList<>();
        }
        return scans.stream()
                .map(scan -> mapToDto(scan))
                .collect(Collectors.toList());
    }
}
