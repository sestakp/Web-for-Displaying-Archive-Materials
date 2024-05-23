import ArchivalRecordList from "../../models/ArchivalRecord/ArchivalRecordList";



export default function formatYear(record: ArchivalRecordList): string | null{
    

    if( record.year?.from != undefined){
        
        return `${record.year.from} - ${record.year.to}`;
    }

    if(record.yearTaken != undefined){
        return record.yearTaken?.toString();
    }

    return ""
}