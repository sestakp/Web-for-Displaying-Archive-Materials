package cz.vut.fit.archiveMaterials.backend.api.controller.mapper;

import cz.vut.fit.archiveMaterials.backend.api.dto.*;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Archive;
import java.util.List;

import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public abstract class ArchiveDtoMapper {

    public abstract Archive map(ArchiveCreateDto archiveCreateDto);

    public abstract Archive map(ArchiveUpdateDto archiveUpdateDto);

    public abstract ArchiveDetailDto map(Archive archive);

    public abstract ArchiveDto mapDtoToArchive(Archive archive);

    public abstract List<ArchiveDetailDto> map(List<Archive> archives);

}
