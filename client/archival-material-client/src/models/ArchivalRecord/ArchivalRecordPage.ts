import ArchivalRecordList from "./ArchivalRecordList";



export default interface ArchivalRecordPage{
    
    content: ArchivalRecordList[];
    
    totalPages: number;
    
    totalElements: number;

}