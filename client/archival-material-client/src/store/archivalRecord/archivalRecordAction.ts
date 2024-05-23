import { createAction } from "@reduxjs/toolkit";
import AppThunk from "../types/appThunk";
import ArchivalRecordTypes from "./archivalRecordType";
import getBoundedNumber from "../../utils/getBoundedNumber";
import ArchivalRecordApi from "../../api/ArchivalRecordApi";
import GetAllArchivalRecordsRequestDto from "../../models/ArchivalRecord/GetAllArchivalRecordsRequest";
import ArchivalRecordList from "../../models/ArchivalRecord/ArchivalRecordList";
import LoadingStatusEnum from "../../models/LoadingStatusEnum";
import TypeOfRecordEnum from "../../models/TypeOfRecordEnum";
import ArchivalRecordDetail from "../../models/ArchivalRecord/ArchivalRecordDetail";
import { NavigateFunction } from "react-router-dom";
import handleServerErrors from "../../utils/handleServerErrors";
import Archive from "../../models/Archive/Archive";
import LocationDto from "../../models/Location/LocationDto";
import UserApi from "../../api/UserApi";
import toastService from "../../utils/ToastUtil";
import AuthTokenUtil from "../../utils/AuthTokenUtil";
import ScanDto from "../../models/Scan/ScanDto";
import logger from "../../utils/loggerUtil";
import RegionDto from "../../models/Location/RegionDto";
import GetCountsByMunicipalityRequestDto from "../../models/ArchivalRecord/GetCountsByMunicipalityRequestDto";
import CountsByMunicipalityDto from "../../models/ArchivalRecord/CountsByMunicipalityDto";




const ArchivalRecordAction = {


    fetchArchivalRecords: (navigate: NavigateFunction, typeOfRecord : TypeOfRecordEnum | undefined): AppThunk => async(dispatch, getState) => {
        try{
            const state = getState();
            
            if(state.archivalRecord.searchOptions.typeOfRecord == TypeOfRecordEnum.UNSET && typeOfRecord === undefined){
                return null;
            }
            
            var request = {
                page: state.archivalRecord.searchOptions.page,
                pageSize: state.archivalRecord.searchOptions.pageSize,
                q: state.archivalRecord.searchOptions.textSearch,
                typeOfRecord: typeOfRecord === undefined ? state.archivalRecord.searchOptions.typeOfRecord : typeOfRecord,
                yearFrom: state.archivalRecord.searchOptions.yearFrom,
                yearTo: state.archivalRecord.searchOptions.yearTo,
                archiveAbbr: state.archivalRecord.searchOptions.archive?.abbreviation,
                onlyFavourites: state.archivalRecord.searchOptions.onlyFavourites,
                onlyWithMyBookmarks: state.archivalRecord.searchOptions.onlyWithBookmarks,
                onlyWithMyNotes: state.archivalRecord.searchOptions.onlyWithNotes,
                onlyDigitalized: state.archivalRecord.searchOptions.onlyDigitalized,
                sortField: state.archivalRecord.searchOptions.sortField,
                sortOrder: state.archivalRecord.searchOptions.sortOrder,
                country: state.archivalRecord.searchOptions.country,
                district: state.archivalRecord.searchOptions.district,
                region: state.archivalRecord.searchOptions.region,
            } as GetAllArchivalRecordsRequestDto;
            
            const storedLocation = state.archivalRecord.searchOptions.location;
            if(storedLocation != undefined){
                request.country = storedLocation.country;
                request.region = storedLocation.region;
                request.district = storedLocation.district;
                request.municipality = storedLocation.municipality;
                request.borough = storedLocation.borough;
            }
            
    
            dispatch(createAction<LoadingStatusEnum>(ArchivalRecordTypes.SET_STATUS)(LoadingStatusEnum.LOADING))
    
            var archivalRecordPage = await ArchivalRecordApi.getAllArchivalRecords(request, AuthTokenUtil.getAuthToken()?.accessToken);
    
            await dispatch(createAction<number>(ArchivalRecordTypes.SET_MAX_PAGE)(archivalRecordPage.totalPages))
            await dispatch(createAction<number>(ArchivalRecordTypes.SET_TOTAL_ELEMENTS)(archivalRecordPage.totalElements))
            
            await dispatch(createAction<ArchivalRecordList[]>(ArchivalRecordTypes.SET_DATA)(archivalRecordPage.content))
            
            dispatch(createAction<LoadingStatusEnum>(ArchivalRecordTypes.SET_STATUS)(LoadingStatusEnum.IDLE))
    
    
            return archivalRecordPage;
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },

    loadNext: (navigate: NavigateFunction): AppThunk => async(dispatch, getState) => {
        try{
            
            const state = getState();

            const canLoadNext = state.archivalRecord.searchOptions.maxPage > (state.archivalRecord.searchOptions.page + state.archivalRecord.searchOptions.nextLoaded)

            if(canLoadNext){
                var request = {
                    page: state.archivalRecord.searchOptions.page + state.archivalRecord.searchOptions.nextLoaded + 1,
                    pageSize: state.archivalRecord.searchOptions.pageSize,
                    q: state.archivalRecord.searchOptions.textSearch,
                    typeOfRecord: state.archivalRecord.searchOptions.typeOfRecord,
                    yearFrom: state.archivalRecord.searchOptions.yearFrom,
                    yearTo: state.archivalRecord.searchOptions.yearTo,
                    archiveAbbr: state.archivalRecord.searchOptions.archive?.abbreviation,
                    onlyFavourites: state.archivalRecord.searchOptions.onlyFavourites,
                    onlyWithMyBookmarks: state.archivalRecord.searchOptions.onlyWithBookmarks,
                    onlyWithMyNotes: state.archivalRecord.searchOptions.onlyWithNotes,
                    onlyDigitalized: state.archivalRecord.searchOptions.onlyDigitalized,
                    sortField: state.archivalRecord.searchOptions.sortField,
                    sortOrder: state.archivalRecord.searchOptions.sortOrder,
                    country: state.archivalRecord.searchOptions.country,
                    district: state.archivalRecord.searchOptions.district,
                    region: state.archivalRecord.searchOptions.region,
                } as GetAllArchivalRecordsRequestDto;
                
                const storedLocation = state.archivalRecord.searchOptions.location;
                if(storedLocation != undefined){
                    request.country = storedLocation.country;
                    request.region = storedLocation.region;
                    request.district = storedLocation.district;
                    request.municipality = storedLocation.municipality;
                    request.borough = storedLocation.borough;
                }
        
                dispatch(createAction<LoadingStatusEnum>(ArchivalRecordTypes.SET_STATUS)(LoadingStatusEnum.LOADING))
        
                var archivalRecordPage = await ArchivalRecordApi.getAllArchivalRecords(request, AuthTokenUtil.getAuthToken()?.accessToken);
        
                
                await dispatch(createAction<ArchivalRecordList[]>(ArchivalRecordTypes.APPEND_PAGE)(archivalRecordPage.content))
                
                dispatch(createAction<LoadingStatusEnum>(ArchivalRecordTypes.SET_STATUS)(LoadingStatusEnum.IDLE))
        
        
                return archivalRecordPage;
            }
            
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },


    getArchivalRecordById: (navigate: NavigateFunction, id: number): AppThunk => async(dispatch, getState) => {
        try{
            dispatch(createAction<LoadingStatusEnum>(ArchivalRecordTypes.SET_STATUS)(LoadingStatusEnum.LOADING))
            const state = getState();

            var detailModel = await ArchivalRecordApi.getArchivalRecordById(id, AuthTokenUtil.getAuthToken()?.accessToken);
    
            await dispatch(createAction<ArchivalRecordDetail>(ArchivalRecordTypes.SET_DETAIL)(detailModel))
    
            dispatch(createAction<LoadingStatusEnum>(ArchivalRecordTypes.SET_STATUS)(LoadingStatusEnum.IDLE))
    
    
            return detailModel;
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
       
    },

    setTypeOfRecord: (typeOfRecord: TypeOfRecordEnum | undefined):AppThunk => (dispatch, getState) => {
        const state = getState()

        if(typeOfRecord != state.archivalRecord.searchOptions.typeOfRecord){
            dispatch(createAction<any>(ArchivalRecordTypes.SET_ORDER)({sortField: undefined, sortOrder: undefined}))
            dispatch(createAction<void>(ArchivalRecordTypes.RESET_FILTERS)())
        }
        return dispatch(createAction<TypeOfRecordEnum | undefined>(ArchivalRecordTypes.SET_TYPE_OF_RECORD)(typeOfRecord))
    },

    setPage: (pageNumber: number | null): AppThunk => (dispatch, getState) => {
        logger.debug("SETTING PAGE: ", pageNumber)
        const state = getState();
        const { minPage, maxPage } = state.archivalRecord.searchOptions;
      
        if (pageNumber == null){
          pageNumber = minPage
        }
        
        const boundedPageNumber = getBoundedNumber(pageNumber, minPage, maxPage);

        return dispatch(createAction<number>(ArchivalRecordTypes.SET_PAGE)(boundedPageNumber))
    },

    incrementPage: (): AppThunk => (dispatch, getState) => {
        const state = getState();
        const { minPage, maxPage, page } = state.archivalRecord.searchOptions;
      
        const boundedPageNumber = getBoundedNumber(page + 1, minPage, maxPage);

        return dispatch(createAction<number>(ArchivalRecordTypes.SET_PAGE)(boundedPageNumber))
    },

    toggleFilterPage: (): AppThunk => (dispatch, getState) => {
        return dispatch(createAction<void>(ArchivalRecordTypes.TOGGLE_FILTERS_OPEN)())
    },

    resetFilters: (): AppThunk => (dispatch, getState) => {
        return dispatch(createAction<void>(ArchivalRecordTypes.RESET_FILTERS)())
    },

    decrementPage: (): AppThunk => (dispatch, getState) => {
        const state = getState();
        const { minPage, maxPage, page } = state.archivalRecord.searchOptions;

        const boundedPageNumber = getBoundedNumber(page - 1, minPage, maxPage);

        return dispatch(createAction<number>(ArchivalRecordTypes.SET_PAGE)(boundedPageNumber))
    },

    setPageSize: (pageSize: number): AppThunk => (dispatch) => {
        return dispatch(createAction<number>(ArchivalRecordTypes.SET_PAGE_SIZE)(pageSize))
    },

    setSearchText: (text: string): AppThunk => (dispatch) => {
        return dispatch(createAction<string>(ArchivalRecordTypes.SET_SEARCH_TEXT)(text))
    },

    setOnlyDigitalized: (digitalized: boolean): AppThunk => (dispatch) => {
        return dispatch(createAction<boolean>(ArchivalRecordTypes.SET_ONLY_DIGITALIZED)(digitalized))
    },

    setYearFrom: (year: number | undefined): AppThunk => (dispatch) => {
        return dispatch(createAction<number|undefined>(ArchivalRecordTypes.SET_YEAR_FROM)(year))
    },

    setYearTo: (year: number | undefined): AppThunk => (dispatch) => {
        return dispatch(createAction<number|undefined>(ArchivalRecordTypes.SET_YEAR_TO)(year))
    },

    setArchive: (archive: Archive | undefined): AppThunk => (dispatch) => {
        return dispatch(createAction<Archive|undefined>(ArchivalRecordTypes.SET_ARCHIVE)(archive))
    },

    setLocation: (location: LocationDto | undefined): AppThunk => (dispatch) => {
        return dispatch(createAction<LocationDto | undefined>(ArchivalRecordTypes.SET_LOCATION)(location))
    },


    setOnlyFavourites: (onlyFavourites: boolean): AppThunk => (dispatch) => {
        return dispatch(createAction<boolean>(ArchivalRecordTypes.SET_ONLY_FAVOURITES)(onlyFavourites))
    },
    
    setCountry: (country: string | undefined): AppThunk => (dispatch) => {
        return dispatch(createAction<string | undefined>(ArchivalRecordTypes.SET_COUNTRY)(country))
    },

    setRegion: (region: string | undefined): AppThunk => (dispatch) => {
        return dispatch(createAction<string | undefined>(ArchivalRecordTypes.SET_REGION)(region))
    },

    setDistrict: (district: string | undefined): AppThunk => async(dispatch, getState) => {
        const state = getState()

        /*if(district != undefined){
            var regions = state.location.regions.filter(r => r.districts.includes(district));

            if(regions.length > 0){
                var region = regions[0]
                await dispatch(createAction<RegionDto | undefined>(ArchivalRecordTypes.SET_REGION)(region))
            }
        }*/


        return dispatch(createAction<string | undefined>(ArchivalRecordTypes.SET_DISTRICT)(district))
    },

    setOnlyWithNotes: (onlyWithNotes: boolean): AppThunk => (dispatch) => {
        return dispatch(createAction<boolean>(ArchivalRecordTypes.SET_ONLY_WITH_NOTES)(onlyWithNotes))

    },

    setOnlyWithBookmarks: (onlyWithBookmarks: boolean): AppThunk => (dispatch) => {
        return dispatch(createAction<boolean>(ArchivalRecordTypes.SET_ONLY_WITH_BOOKMARKS)(onlyWithBookmarks))
    },

    addToFavourites: (navigate: NavigateFunction, id: number | undefined): AppThunk => async(dispatch, getState) => {
        try{
            if(id != undefined){
                const state = getState()
                
                const currentUser = AuthTokenUtil.getAuthToken();

                if(currentUser != undefined){
                    await UserApi.addToFavourites(id, currentUser.accessToken)
                    toastService.successToast("Archiválie přidána k oblíbeným")
                    let detail = state.archivalRecord.detail;
                    if(detail != undefined){

                        detail = {...detail}
                        detail.isFavourite = true;
                        await dispatch(createAction<ArchivalRecordDetail>(ArchivalRecordTypes.SET_DETAIL)(detail))
                    }
                }
            }
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },

    removeFromFavourites: (navigate: NavigateFunction, id: number | undefined): AppThunk => async(dispatch, getState) => {
        try{
            if(id != undefined){
                const state = getState()

                const currentUser = AuthTokenUtil.getAuthToken();
                if(currentUser != undefined){
                    await UserApi.removeFromFavourites(id, currentUser.accessToken)
                    toastService.successToast("Archiválie odebrána z oblíbených")
                    let detail = state.archivalRecord.detail;
                    if(detail != undefined){

                        detail = {...detail}
                        detail.isFavourite = false;
                        await dispatch(createAction<ArchivalRecordDetail>(ArchivalRecordTypes.SET_DETAIL)(detail))
                    }
                }
            }            
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },

    getScans: (navigate: NavigateFunction, id: number): AppThunk => async(dispatch) => {
        try{
            var scanModel = await ArchivalRecordApi.getScans(id);

            if(scanModel.scans != undefined){
                return dispatch(createAction<ScanDto[]>(ArchivalRecordTypes.SET_SCANS)(scanModel.scans))
            }
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },

    getCountsByMunicipality: (navigate: NavigateFunction): AppThunk => async(dispatch, getState) => {
        try{
            const state = getState();
            var response = {
                country: state.archivalRecord.searchOptions.location?.country,
                region: state.archivalRecord.searchOptions.location?.region,
                district: state.archivalRecord.searchOptions.location?.district,
                municipality: state.archivalRecord.searchOptions.location?.municipality,
                borough: state.archivalRecord.searchOptions.location?.borough
            } as GetCountsByMunicipalityRequestDto;

            var result = await ArchivalRecordApi.getCountsByMunicipality(response);
            
            return dispatch(createAction<CountsByMunicipalityDto>(ArchivalRecordTypes.SET_COUNTS)(result))
            
        }
        catch(error){
            handleServerErrors(navigate, error);
        }
    },

    setOrder: (sortField: string | undefined, sortOrder: 0 | 1 | -1 | null | undefined): AppThunk => async(dispatch) => {

        return dispatch(createAction<any>(ArchivalRecordTypes.SET_ORDER)({sortField, sortOrder}))
    },

}

export default ArchivalRecordAction;