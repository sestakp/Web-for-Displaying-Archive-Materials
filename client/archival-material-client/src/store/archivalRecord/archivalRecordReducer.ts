import { AnyAction } from "@reduxjs/toolkit";
import ArchivalRecordState from "./archivalRecordState/archivalRecordStateInterface";
import archivalRecordDefaultState from "./archivalRecordState/archivalRecordDefaultState";
import ArchivalRecordTypes from "./archivalRecordType";
import logger from "../../utils/loggerUtil";


const archivalRecordReducer = (state: ArchivalRecordState = archivalRecordDefaultState, action: AnyAction): ArchivalRecordState => {
    switch (action.type) {
        case ArchivalRecordTypes.SET_DATA:
            return { ...state, data: action.payload, searchOptions: { ...state.searchOptions }};

        case ArchivalRecordTypes.APPEND_PAGE:
            return { ...state, data: [...state.data, ...action.payload], searchOptions : { ...state.searchOptions, nextLoaded: state.searchOptions.nextLoaded + 1}}
        
        case ArchivalRecordTypes.SET_MAX_PAGE:
            return { ...state, searchOptions : { ...state.searchOptions, maxPage: action.payload} };

        case ArchivalRecordTypes.SET_PAGE:
            return { ...state, searchOptions : { ...state.searchOptions, page: action.payload, nextLoaded: 0 } };

        case ArchivalRecordTypes.SET_DETAIL:
            return { ...state, detail: {...action.payload} }
        
        case ArchivalRecordTypes.SET_PAGE_SIZE:
            return { ...state, searchOptions : { ...state.searchOptions, pageSize: action.payload, page: 1} };
        
        case ArchivalRecordTypes.SET_SEARCH_TEXT:
            return { ...state, searchOptions : { ...state.searchOptions, textSearch: action.payload} };
   
        case ArchivalRecordTypes.SET_YEAR_FROM:
            return { ...state, searchOptions : { ...state.searchOptions, yearFrom: action.payload} };

        case ArchivalRecordTypes.SET_ONLY_DIGITALIZED:
            return { ...state, searchOptions : { ...state.searchOptions, onlyDigitalized: action.payload} };

        case ArchivalRecordTypes.SET_TOTAL_ELEMENTS:
            return { ...state, searchOptions: { ...state.searchOptions, totalElements: action.payload }}
            
        case ArchivalRecordTypes.SET_YEAR_TO:
            return { ...state, searchOptions : { ...state.searchOptions, yearTo: action.payload} };

        case ArchivalRecordTypes.SET_ARCHIVE:
            return { ...state, searchOptions : { ...state.searchOptions, archive: action.payload} };
        
        case ArchivalRecordTypes.SET_LOCATION:
            return { ...state, searchOptions : { ...state.searchOptions, location: action.payload} };

        case ArchivalRecordTypes.SET_ONLY_FAVOURITES:
            return { ...state, searchOptions : { ...state.searchOptions, onlyFavourites: action.payload} };

        case ArchivalRecordTypes.SET_DISTRICT:
            return { ...state, searchOptions : { ...state.searchOptions, district: action.payload, location: undefined} };
        
        case ArchivalRecordTypes.SET_COUNTRY:
            return { ...state, searchOptions : { ...state.searchOptions, country: action.payload, region: undefined, district: undefined, location: undefined} };
            
        case ArchivalRecordTypes.SET_REGION:
            return { ...state, searchOptions : { ...state.searchOptions, region: action.payload, district: undefined, location: undefined} };
        
        case ArchivalRecordTypes.SET_ONLY_WITH_BOOKMARKS:
            return { ...state, searchOptions : { ...state.searchOptions, onlyWithBookmarks: action.payload} };
        
        case ArchivalRecordTypes.SET_ONLY_WITH_NOTES:
            return { ...state, searchOptions : { ...state.searchOptions, onlyWithNotes: action.payload} };
        
        case ArchivalRecordTypes.SET_TYPE_OF_RECORD:
            let newState = { ...state, searchOptions : { ...state.searchOptions, typeOfRecord: action.payload, page: 1} }
            if(state.searchOptions.typeOfRecord != action.payload){
                newState.data = []
            }
            return newState;

        case ArchivalRecordTypes.SET_SCANS:
            if(state.detail != undefined){
                return { ...state, detail: { ...state.detail, scans: action.payload } }
            }
            return state;

        case ArchivalRecordTypes.SET_STATUS:
            return { ...state, status: action.payload }

        case ArchivalRecordTypes.TOGGLE_FILTERS_OPEN:
            return { ...state, filtersOpen: ! state.filtersOpen}
        case ArchivalRecordTypes.RESET_FILTERS:

            return { ...state, searchOptions: { ...state.searchOptions, textSearch: "", country: undefined, region: undefined, archive: undefined, district: undefined, location: undefined, onlyDigitalized: false, yearFrom: undefined, yearTo: undefined, }}
        
        case ArchivalRecordTypes.SET_COUNTS:
            return { ...state, counts: action.payload }

        case ArchivalRecordTypes.SET_ORDER:
            return { ...state, searchOptions: { ...state.searchOptions, sortField: action.payload.sortField, sortOrder: action.payload.sortOrder}}
        default:
            return state;
    }


}

export default archivalRecordReducer