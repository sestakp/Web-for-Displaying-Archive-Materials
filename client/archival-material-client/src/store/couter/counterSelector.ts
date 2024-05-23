
import RootState from "../types/rootState";

const counterSelector = {

    getCounterValue: (state: RootState) => state.counter.value,
    getCounterStatus: (state: RootState) => state.counter.status,
    getErrorMessage: (state: RootState) => state.counter.errorMessage,

}

export default counterSelector;