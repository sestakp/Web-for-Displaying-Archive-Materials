import RootState from "../types/rootState";



const archiveSelector = {

    getData: (state: RootState) => state.archive.data,
    getStatus: (state: RootState) => state.archive.status,
}

export default archiveSelector;