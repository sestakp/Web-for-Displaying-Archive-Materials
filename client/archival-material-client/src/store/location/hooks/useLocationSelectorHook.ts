import { useMemo } from "react";
import { useAppSelector } from "../../hooks";
import locationSelector from "../locationSelector";



const useLocationSelector = () => {

    const locations = useAppSelector(locationSelector.getLocations);
    const countries = useAppSelector(locationSelector.getCountries);
    const districts = useAppSelector(locationSelector.getDistricts);
    const regions = useAppSelector(locationSelector.getRegions);
    const status = useAppSelector(locationSelector.getStatus);

    const result = useMemo(() => {
        return {
            locations,
            districts,
            countries,
            regions,
            status
        };
    }, [locations, districts, countries, regions]);
    
    return result;
}

export default useLocationSelector;