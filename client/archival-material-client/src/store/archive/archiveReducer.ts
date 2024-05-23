import { AnyAction } from "@reduxjs/toolkit"
import ArchiveState from "./archiveState/archiveStateInterface"
import archiveDefaultState from "./archiveState/archiveDefaultState"
import ArchiveType from "./archiveType";








const archiveReducer = (state: ArchiveState = archiveDefaultState, action: AnyAction): ArchiveState => {

    switch (action.type) {

        case ArchiveType.SET_DATA:
            return { ...state, data: action.payload};
        
        case ArchiveType.SET_STATUS:
            return { ...state, status: action.payload }
            
        default:
            return state;
    }

}

export default archiveReducer;