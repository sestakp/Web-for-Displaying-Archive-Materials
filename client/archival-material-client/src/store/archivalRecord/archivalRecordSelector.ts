import RootState from "../types/rootState";

const archivalRecordSelector = {

    getData: (state: RootState) => state.archivalRecord.data,
    getStatus: (state: RootState) => state.archivalRecord.status,
    getDetail: (state: RootState) => state.archivalRecord.detail,
    isFiltersOpen: (state: RootState) => state.archivalRecord.filtersOpen,
    getSearchOptions: (state: RootState) => state.archivalRecord.searchOptions,
    getCounts: (state: RootState) => state.archivalRecord.counts,
}

export default archivalRecordSelector;