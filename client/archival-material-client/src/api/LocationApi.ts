import axios from "axios";
import LocationPageDto from "../models/Location/LocationPageDto";
import TODO from "../models/TODO";
import RegionDto from "../models/Location/RegionDto";
import CountryDto from "../models/Location/CountryDto";





const baseUrl = process.env.REACT_APP_API_URL + "/locations";


const LocationApi = {

    getLocations: async(q: string, district: string | undefined, region: string | undefined): Promise<LocationPageDto> => {
        const response = await axios.get(baseUrl, {
            params: {
                q,
                region,
                district
            }
        })
        return response.data;
    },

    getCountries: async(): Promise<string[]> => {
        const response = await axios.get(baseUrl + "/countries")
        return response.data;
    },

    getDistricts: async(country: string | undefined, region: string | undefined): Promise<RegionDto[]> => {
        const response = await axios.get(baseUrl + "/districts", {
            params: {
                country,
                region
            }
        })
        return response.data;
    },

    getRegions: async(country: string | undefined): Promise<CountryDto[]> => {
        const response = await axios.get(baseUrl + "/regions", {
            params: {
                country
            }
        })
        return response.data;
    }
}

export default LocationApi;