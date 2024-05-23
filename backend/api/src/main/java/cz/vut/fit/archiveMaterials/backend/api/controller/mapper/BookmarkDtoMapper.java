package cz.vut.fit.archiveMaterials.backend.api.controller.mapper;

import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Bookmark;
import cz.vut.fit.archiveMaterials.backend.api.dto.BookmarkDetailDto;
import cz.vut.fit.archiveMaterials.backend.api.dto.BookmarkRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class BookmarkDtoMapper {

    @Mapping(target = "archivalRecordId", source = "archivalRecord.id")
    @Mapping(target = "scanUrl", source = "scan.url")
    public abstract BookmarkDetailDto map(Bookmark bookmark);


    @Mapping(target = "archivalRecord.id", source = "archivalRecordId")
    @Mapping(target = "scan.url", source = "scanUrl")
    public abstract Bookmark map(BookmarkRequestDto bookmark);

    @Named("mapListOfArchivalRecords")
    public List<BookmarkDetailDto> mapCollectionOfBookmarks(Collection<Bookmark> bookmarks) {

        var listDtos = new ArrayList<BookmarkDetailDto>();

        if (bookmarks != null){
            for(var record : bookmarks) {
                var dto = map(record);
                listDtos.add(dto);
            }
        }

        return listDtos;
    }
}
