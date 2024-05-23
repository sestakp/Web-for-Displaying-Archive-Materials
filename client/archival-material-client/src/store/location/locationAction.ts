import { NavigateFunction } from "react-router-dom";
import AppThunk from "../types/appThunk";
import { createAction } from "@reduxjs/toolkit";
import LoadingStatusEnum from "../../models/LoadingStatusEnum";
import LocationType from "./locationType";
import LocationApi from "../../api/LocationApi";
import LocationListDto from "../../models/Location/LocationListDto";
import handleServerErrors from "../../utils/handleServerErrors";
import RegionDto from "../../models/Location/RegionDto";
import CountryDto from "../../models/Location/CountryDto";




const LocationAction = {

    fetchLocations: (navigate: NavigateFunction, q:string): AppThunk => async(dispatch, getState) => {
        try{
            const state = getState();
    
    
            dispatch(createAction<LoadingStatusEnum>(LocationType.SET_STATUS)(LoadingStatusEnum.LOADING))
    
            var locationPageDto = await LocationApi.getLocations(q, state.archivalRecord.searchOptions.district, state.archivalRecord.searchOptions.region);
            
            await dispatch(createAction<LocationListDto[]>(LocationType.SET_LOCATIONS)(locationPageDto.content))
            
            dispatch(createAction<LoadingStatusEnum>(LocationType.SET_STATUS)(LoadingStatusEnum.IDLE))
    
            return locationPageDto;
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },

    
    fetchDistricts: (navigate: NavigateFunction): AppThunk => async(dispatch, getState) => {
        try{
            const state = getState();
    
    
            dispatch(createAction<LoadingStatusEnum>(LocationType.SET_STATUS)(LoadingStatusEnum.LOADING))
            console.log("search options: ", state.archivalRecord.searchOptions)
            var districts = await LocationApi.getDistricts(state.archivalRecord.searchOptions.country, state.archivalRecord.searchOptions.region);
            
            await dispatch(createAction<RegionDto[]>(LocationType.SET_DISTRICTS)(districts))
            
            dispatch(createAction<LoadingStatusEnum>(LocationType.SET_STATUS)(LoadingStatusEnum.IDLE))
    
            return districts;
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },

    fetchRegions: (navigate: NavigateFunction): AppThunk => async(dispatch, getState) => {
        try{
            const state = getState();
    
    
            dispatch(createAction<LoadingStatusEnum>(LocationType.SET_STATUS)(LoadingStatusEnum.LOADING))
    
            var regions = await LocationApi.getRegions(state.archivalRecord.searchOptions.country);
            
            await dispatch(createAction<CountryDto[]>(LocationType.SET_REGIONS)(regions))
            
            dispatch(createAction<LoadingStatusEnum>(LocationType.SET_STATUS)(LoadingStatusEnum.IDLE))
    
            return regions;
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },

    fetchCountries: (navigate: NavigateFunction): AppThunk => async(dispatch, getState) => {
        try{
            const state = getState();
    
    
            dispatch(createAction<LoadingStatusEnum>(LocationType.SET_STATUS)(LoadingStatusEnum.LOADING))
    
            var countries = await LocationApi.getCountries();
            
            await dispatch(createAction<string[]>(LocationType.SET_COUNTRIES)(countries))
            
            dispatch(createAction<LoadingStatusEnum>(LocationType.SET_STATUS)(LoadingStatusEnum.IDLE))
    
            return countries;
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },
}

export default LocationAction;