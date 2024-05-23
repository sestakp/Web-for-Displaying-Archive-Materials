import ArchivalRecordList from "../../models/ArchivalRecord/ArchivalRecordList";



export default function formatDescription(record: ArchivalRecordList) : string | null{
    let description = ""

    //if(record.archive != undefined && record.archive != ""){
    //    description += `Archiv: ${record.archive}\n`
    // }

    if(record.otherNote != undefined && record.otherNote != ""){
        description += `Poznámka: ${record.otherNote}\n`
    }

    if(record.content != undefined && record.content != ""){
        description += `Obsah: ${record.content}\n`
    }

    if(record.landRegistryNrs != undefined && record.landRegistryNrs != ""){
        description += `Čísla popisná: ${record.landRegistryNrs}\n`
    }

    
    if(record.description != undefined && record.description != ""){
        description += `Popis: ${record.description}\n`
    }

    if (description.charAt(description.length - 1) === '\n') {
        description = description.slice(0, -1); // Remove the last character
    }

    return description;
}