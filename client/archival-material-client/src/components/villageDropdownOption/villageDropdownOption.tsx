


const VillageDropdownOption = (option: any) => {

    let smallText = "";

    if(option.country != undefined){
        smallText = option.country
    }


    if(option.region != undefined){
        if(smallText != ""){
            smallText += " - "
        }

        smallText += option.region
    }

    if(option.district != undefined){
        if(smallText != ""){
            smallText += " - "
        }

        smallText += option.district
    }

    return (
        <div>
            <div>
                {option.municipality}
                {option.borough != undefined &&
                    <span>&nbsp;({option.borough})</span>
                }
            </div>
            <div>
                <small>{smallText}</small>
            </div>
        </div>
    )
}

export default VillageDropdownOption;