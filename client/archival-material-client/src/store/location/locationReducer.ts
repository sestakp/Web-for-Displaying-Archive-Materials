import { AnyAction } from "@reduxjs/toolkit";
import LocationState from "./locationState/locationStateInterface";
import locationDefaultState from "./locationState/locationDefaultState";
import LocationType from "./locationType";









const locationReducer = (state: LocationState = locationDefaultState, action: AnyAction): LocationState => {


    switch (action.type) {
        
        case LocationType.SET_LOCATIONS:
            return { ...state, locations: action.payload};
        
        case LocationType.SET_REGIONS:
            return { ...state, regions: action.payload};
            
        case LocationType.SET_DISTRICTS:
            return { ...state, districts: action.payload};
        
        case LocationType.SET_COUNTRIES:
            return { ...state, countries: action.payload};    
        
        case LocationType.SET_STATUS:
            return { ...state, status: action.payload }

        default:
            return state;
    }

}

export default locationReducer;