import LocationDto from "../../models/Location/LocationDto";


const VillagePreviewTemplate = (village : LocationDto) => {
    // Custom preview template for the selected item

    let result = village.municipality;
    if(village.borough != undefined){
        result += ` (${village.borough})`
    }
    return result;
  };

  

export default VillagePreviewTemplate