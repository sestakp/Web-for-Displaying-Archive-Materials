package cz.vut.fit.archiveMaterials.backend.api.controller.mapper;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Note;
import cz.vut.fit.archiveMaterials.backend.api.dto.NoteDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.NoteRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class NoteDtoMapper {


    @Mapping(target = "archivalRecordId", source = "archivalRecord.id")
    @Mapping(target = "scanUrl", source = "scan.url")
    public abstract NoteDetailDto map(Note note);

    @Mapping(target = "archivalRecord.id", source = "archivalRecordId")
    @Mapping(target = "scan.url", source = "scanUrl")
    public abstract Note map(NoteRequestDto note);

    @Named("mapListOfArchivalRecords")
    public List<NoteDetailDto> mapCollectionOfNotes(Collection<Note> notes) {

        var listDtos = new ArrayList<NoteDetailDto>();

        if (notes != null){
            for(var record : notes) {
                var dto = map(record);
                listDtos.add(dto);
            }
        }

        return listDtos;
    }
}
