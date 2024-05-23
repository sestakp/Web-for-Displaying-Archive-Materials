import ArchivalRecordDetail from "../../models/ArchivalRecord/ArchivalRecordDetail";
import ArchivalRecordList from "../../models/ArchivalRecord/ArchivalRecordList";
import logger from "../loggerUtil";



export default function formatName(record: ArchivalRecordList | ArchivalRecordDetail | undefined): string{
    let name = ""
    
    if( record == undefined){
        return name;
    }


    if(record.fund?.name != undefined){
        if(name != ""){
            name += " • "
        }
        name += `Fond ${record.fund.name}`;


        if(record.fund.code != undefined){
            name += ` (${record.fund.code})`
        }
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

    if(record.locations.length > 0){
        var i = 0;
        while(i < record.locations.length && name.length < 80){
            if(record.locations[i].municipality != undefined){
                
                if(i == 0){
                    if(name != ""){
                        name += " • "
                    }
                    name += `Obec ${record.locations[i].municipality}`;
                    if(record.locations[i].borough){
                        name += ` (${record.locations[i].borough})`
                    }
                }
                else{
                    name += `, ${record.locations[i].municipality}`;
                    if(record.locations[i].borough){
                        name += ` (${record.locations[i].borough})`
                    }
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