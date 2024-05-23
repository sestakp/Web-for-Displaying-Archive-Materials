import Archive from "./Archive/Archive";
import CountryDto from "./Location/CountryDto";
import LocationDto from "./Location/LocationDto";
import RegionDto from "./Location/RegionDto";
import ArchivalRecordTypeEnum from "./TypeOfRecordEnum";

export default interface SearchOptions{
    page: number;
    pageSize: number;
    textSearch: string;
    minPage: number;
    maxPage: number;
    typeOfRecord: ArchivalRecordTypeEnum;
    yearFrom?: number;
    yearTo?: number;
    archive?: Archive;
    location?: LocationDto;
    onlyFavourites?: boolean;
    onlyWithNotes?: boolean;
    onlyWithBookmarks?: boolean;
    nextLoaded: number;
    totalElements: number;
    country?: string;
    region?: string;
    district?: string;
    onlyDigitalized: boolean;
    sortField?: string;
    sortOrder?: 0 | 1 | -1 | null | undefined;
}