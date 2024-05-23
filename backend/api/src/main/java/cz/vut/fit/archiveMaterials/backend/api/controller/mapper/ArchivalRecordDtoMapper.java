package cz.vut.fit.archiveMaterials.backend.api.controller.mapper;

import cz.vut.fit.archiveMaterials.backend.api.domain.dto.ScansResult;
import cz.vut.fit.archiveMaterials.backend.api.domain.embeddable.Fund;
import cz.vut.fit.archiveMaterials.backend.api.domain.entity.Scan;
import cz.vut.fit.archiveMaterials.backend.api.domain.dto.ArchivalRecordPage;
import cz.vut.fit.archiveMaterials.backend.api.dto.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;


import cz.vut.fit.archiveMaterials.backend.api.domain.entity.ArchivalRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = {LanguageMapper.class, LocationDtoMapper.class, ScanDtoMapper.class})
public abstract class ArchivalRecordDtoMapper {

    @Mapping(target = "archive.name", source = "archive")
    @Mapping(target = "languages", source = "languages", qualifiedByName = "mapLanguages")
    @Mapping(target = "scans", source = "scans", qualifiedByName = "mapScans")
    @Mapping(target = "year.from", source = "yearFrom")
    @Mapping(target = "year.to", source = "yearTo")
    @Mapping(target = "fund.name", source = "fundName")
    @Mapping(target = "fund.code", source = "fundCode")
    @Mapping(target = "originator.type", source = "originatorType")
    @Mapping(target = "originator.note", source = "originatorNote")
    @Mapping(target = "originator.name", source = "originatorName")
    @Mapping(target = "yearBorn.from", source = "yearBornFrom")
    @Mapping(target = "yearBorn.to", source = "yearBornTo")
    @Mapping(target = "yearBornIndex.from", source = "yearBornIndexFrom")
    @Mapping(target = "yearBornIndex.to", source = "yearBornIndexTo")
    @Mapping(target = "yearMarried.from", source = "yearMarriedFrom")
    @Mapping(target = "yearMarried.to", source = "yearMarriedTo")
    @Mapping(target = "yearMarriedIndex.from", source = "yearMarriedIndexFrom")
    @Mapping(target = "yearMarriedIndex.to", source = "yearMarriedIndexTo")
    @Mapping(target = "yearDeceased.from", source = "yearDeceasedFrom")
    @Mapping(target = "yearDeceased.to", source = "yearDeceasedTo")
    @Mapping(target = "yearDeceasedIndex.from", source = "yearDeceasedIndexFrom")
    @Mapping(target = "yearDeceasedIndex.to", source = "yearDeceasedIndexTo")
    public abstract ArchivalRecord map(ArchivalRecordCreateDto archivalRecordCreateDto);

    @Mapping(target = "archive.name", source = "archive")
    @Mapping(target = "languages", source = "languages", qualifiedByName = "mapLanguages")
    @Mapping(target = "scans", source = "scans", qualifiedByName = "mapScans")
    @Mapping(target = "year.from", source = "yearFrom")
    @Mapping(target = "year.to", source = "yearTo")
    @Mapping(target = "fund.name", source = "fundName")
    @Mapping(target = "fund.code", source = "fundCode")
    @Mapping(target = "originator.type", source = "originatorType")
    @Mapping(target = "originator.note", source = "originatorNote")
    @Mapping(target = "originator.name", source = "originatorName")
    @Mapping(target = "yearBorn.from", source = "yearBornFrom")
    @Mapping(target = "yearBorn.to", source = "yearBornTo")
    @Mapping(target = "yearBornIndex.from", source = "yearBornIndexFrom")
    @Mapping(target = "yearBornIndex.to", source = "yearBornIndexTo")
    @Mapping(target = "yearMarried.from", source = "yearMarriedFrom")
    @Mapping(target = "yearMarried.to", source = "yearMarriedTo")
    @Mapping(target = "yearMarriedIndex.from", source = "yearMarriedIndexFrom")
    @Mapping(target = "yearMarriedIndex.to", source = "yearMarriedIndexTo")
    @Mapping(target = "yearDeceased.from", source = "yearDeceasedFrom")
    @Mapping(target = "yearDeceased.to", source = "yearDeceasedTo")
    @Mapping(target = "yearDeceasedIndex.from", source = "yearDeceasedIndexFrom")
    @Mapping(target = "yearDeceasedIndex.to", source = "yearDeceasedIndexTo")
    public abstract ArchivalRecord map(ArchivalRecordUpdateDto archivalRecordUpdateDto);

    @Mapping(target = "languages", source = "languages", qualifiedByName = "mapLanguagesRev")
    @Mapping(target = "locations", source = "locations", qualifiedByName = "mapCollectionOfLocations")
    @Mapping(target = "firstScan", source = "scans", qualifiedByName = "mapFirstScan")
    public abstract ArchivalRecordDetailDto map(ArchivalRecord archivalRecord);




    public abstract FundDto map(Fund fund);

    //no list of details
    //@Mapping(target = "languages", source = "languages", qualifiedByName = "mapLanguagesRev")
    //@Mapping(target = "locations", source = "locations", qualifiedByName = "mapListOfLocations")
    //public abstract List<ArchivalRecordDetailDto> map(List<ArchivalRecord> archivalRecords);

    @Mapping(target = "content", source = "content", qualifiedByName = "mapListOfArchivalRecords")
    public abstract ArchivalRecordPageDto map(ArchivalRecordPage page);

    @Mapping(target = "locations", source = "locations", qualifiedByName = "mapCollectionOfLocationLists")
    @Mapping(target = "archive", source = "archive.name")
    public abstract ArchivalRecordListDto mapToList(ArchivalRecord archivalRecord);


    @Named("mapFirstScan")
    protected ScanDto mapFirstScan(Collection<Scan> scans) {
        if (scans != null && !scans.isEmpty()) {
            Optional<Scan> firstScanOptional = scans.stream()
                    .filter(scan -> scan.getOrderNumber() != null && scan.getOrderNumber() == 1)
                    .findFirst();

            if (firstScanOptional.isPresent()) {
                Scan firstScan = firstScanOptional.get();
                ScanDto scanDto = new ScanDto();
                scanDto.setUrl(firstScan.getUrl());
                scanDto.setPreFetchUrl(firstScan.getPreFetchUrl());
                return scanDto;
            }
        }
        return null;
    }

    @Named("mapListOfArchivalRecords")
    public List<ArchivalRecordListDto> mapListOfArchivalRecords(List<ArchivalRecord> archivalRecords) {

        var listDtos = new ArrayList<ArchivalRecordListDto>();

        if (archivalRecords != null){
            for(var record : archivalRecords) {
                var dto = mapToList(record);
                listDtos.add(dto);
            }
        }

        return listDtos;
    }


    public abstract ArchivalRecordScansDto mapScans(ScansResult scans);

}
