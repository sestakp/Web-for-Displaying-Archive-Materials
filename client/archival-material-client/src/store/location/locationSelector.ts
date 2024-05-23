import RootState from "../types/rootState";









const locationSelector = {
    getLocations: (state: RootState) => state.location.locations,
    getRegions: (state: RootState) => state.location.regions,
    getDistricts: (state: RootState) => state.location.districts,
    getCountries: (state: RootState) => state.location.countries,
    getStatus: (state: RootState) => state.location.status,
}

export default locationSelector;