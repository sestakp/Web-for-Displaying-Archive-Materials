import RootState from "../types/rootState";






const bookmarkSelector = {
    getData: (state: RootState) => state.bookmark.data,
}

export default bookmarkSelector;