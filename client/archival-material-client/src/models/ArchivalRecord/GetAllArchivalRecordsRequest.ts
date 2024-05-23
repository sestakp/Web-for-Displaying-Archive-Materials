import ArchivalRecordTypeEnum from "../TypeOfRecordEnum"


export default interface GetAllArchivalRecordsRequest{
    pageSize: number,
    page: number,
    typeOfRecord: ArchivalRecordTypeEnum,
    q: string,
    archiveAbbr?: string,
    yearFrom?: number,
    yearTo?: number,
    country?: string,
    region?: string,
    district?: string,
    municipality?: string,
    borough?: string,
    onlyFavourites?: boolean,
    onlyWithMyNotes?: boolean,
    onlyWithMyBookmarks?: boolean,
    onlyDigitalized?:boolean,
    sortField?: string;
    sortOrder?: 0 | 1 | -1 | null | undefined;
}