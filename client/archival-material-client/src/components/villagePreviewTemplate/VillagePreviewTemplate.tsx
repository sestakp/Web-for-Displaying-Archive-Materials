import LocationListDto from "../../models/Location/LocationListDto";


const VillagePreviewTemplate = (village : LocationListDto) => {
    // Custom preview template for the selected item

    let result = village.municipality;
    if(village.borough != undefined){
        result += ` (${village.borough})`
    }
    return result;
  };

  

export default VillagePreviewTemplate