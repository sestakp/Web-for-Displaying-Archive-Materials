import ArchivalRecordTypeEnum from "../../../models/TypeOfRecordEnum";
import LoadingStatusEnum from "../../../models/LoadingStatusEnum";
import ArchivalRecordState from "./archivalRecordStateInterface";



const archivalRecordDefaultState: ArchivalRecordState = {
    data: [],
    detail: undefined,
    status: LoadingStatusEnum.IDLE,
    searchOptions: {
        page: 1,
        pageSize: 10,
        textSearch: "",
        minPage: 1,
        maxPage: 1,
        typeOfRecord: ArchivalRecordTypeEnum.UNSET,
        onlyFavourites: false,
        onlyWithBookmarks: false,
        onlyWithNotes: false,
        nextLoaded: 0,
        totalElements: 0,
        onlyDigitalized: false,
    },
    filtersOpen: false,
    counts: {
        lanoveRejstriky: 0,
        matriky: 0,
        pozemkoveKnihy: 0,
        retrifikacniAkta: 0,
        scitaciOperatory: 0,
        urbare: 0,
    }
};

export default archivalRecordDefaultState