import ArchivalRecordDetail from "../../models/ArchivalRecord/ArchivalRecordDetail";
import ArchivalRecordList from "../../models/ArchivalRecord/ArchivalRecordList";
import logger from "../loggerUtil";



export default function formatNameShorter(record: ArchivalRecordList | ArchivalRecordDetail | undefined): string{
    let name = ""
    
    if( record == undefined){
        return name;
    }

   

    if(record.inventoryNumber != undefined){
        if(name != ""){
            name += " • "
        }
        name += `Inv. č. ${record.inventoryNumber}`
    }

    if(record.signature != undefined){
        if(name != ""){
            name += " • "
        }
        name += `Sig ${record.signature}`
    }

    if(record.nad != undefined){
        if(name != ""){
            name += " • "
        }
        name += `NAD ${record.nad}`
    }

    if(record.year != undefined){
        if(name != ""){
            name += " • "
        }
        name += `Rok ${record.year.from} - ${record.year.to}`
    }

    
    if(record.locations.length > 0){
        var i = 0;
        while(i < record.locations.length && name.length < 80){
            if(record.locations[i].municipality != undefined){
                
                if(i == 0){
                    if(name != ""){
                        name += " • "
                    }
                    name += `Obec ${record.locations[i].municipality}`;
                }
                else{
                    name += `, ${record.locations[i].municipality}`;
                }
            }
            i = i + 1;
        }
        if(i < record.locations.length){
            name += "...";
        }
        
    }

    return name
}