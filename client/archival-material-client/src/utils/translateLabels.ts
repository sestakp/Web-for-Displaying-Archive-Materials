




export default function translateLabels(identifier: string){


    switch(identifier){

        case "signature":
            return "Signatura"
        
        case "yearBorn":
            return "Narození"

        case "yearBornIndex":
            return "Index narozených"

        case "year":
            return "Rok"
        
        case "nad":
            return "NAD"
        
        case "yearDeceased":
            return "Zemřelí"

        case "yearDeceasedIndex":
            return "Index zemřelých"

        case "yearMarriedIndex":
            return "Index oddaných"
        
        case "yearMarried":
            return "Oddaní"
        
        case "inventoryNumber":
            return "Inventární číslo"

        case "languages":
            return "Jazyk"

        case "archive":
            return "Archiv"

        case "otherNote":
            return "Poznámka"

        
        case "originator":
            return "Původce"

        case "fund":
            return "Fond"

        case "description":
            return "Popis archiválie"
        
        case "content":
            return "Obsah"
        
        case "judicialDistrict":
            return "Soudní okres"
        
        
        case "landRegistryNrs":
            return "Čísla popisná"

    
        case "indexOnly":
            return "Pouze index"

        case "originalName":
            return "Původní název"
    
        case "recordMethod":
            return "Poznámka"

        
        case "yearTaken":
            return "Rok"

        default:
            return identifier;
    }

}