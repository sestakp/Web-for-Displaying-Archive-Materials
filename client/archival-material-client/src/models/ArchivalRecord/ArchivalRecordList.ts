import Fund from "../Fund/Fund";
import LocationListDto from "../Location/LocationListDto";
import TimeRange from "../TimeRange";



export default interface ArchivalRecordList {
    id: number;
    yearTaken: number;
    otherNote: string;
    inventoryNumber: string;
    nad: number;
    fund: Fund;
    locations: LocationListDto[];
    signature: string;
    year: TimeRange;
    content: string;
    archive: string;
    description: string;
    landRegistryNrs: string;
}