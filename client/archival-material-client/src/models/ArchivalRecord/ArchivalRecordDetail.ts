import Archive from "../Archive/Archive";
import Fund from "../Fund/Fund";
import LocationDto from "../Location/LocationDto";
import ScanDto from "../Scan/ScanDto";
import TimeRange from "../TimeRange";
import TypeOfRecordEnum from "../TypeOfRecordEnum";
import ArchivalRecordList from "./ArchivalRecordList";


export default interface ArchivalRecordDetail {
    id: number;
    signature: string;
    link: string;
    locations: LocationDto[];
    scans?: ScanDto[];
    firstScan?: ScanDto;
    numberOfScans: number;
    archive: Archive;
    isFavourite: boolean;
    typeOfRecord: TypeOfRecordEnum;
    lastUpdated?: string;
    yearTaken: number;
    otherNote: string;
    inventoryNumber: string;
    nad: number;
    fund: Fund;
    year: TimeRange;
    content: string;
    description: string;
    
}