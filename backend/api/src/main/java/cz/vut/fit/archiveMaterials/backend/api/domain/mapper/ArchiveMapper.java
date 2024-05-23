package cz.vut.fit.archiveMaterials.backend.api.domain.mapper;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ArchiveMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "archivalRecords", ignore = true)
    void update(Archive source, @MappingTarget Archive target);

}
