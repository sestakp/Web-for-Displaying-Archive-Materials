
import counterReducer from "./couter/counterReducer";
import archivalRecordReducer from "./archivalRecord/archivalRecordReducer";
import userReducer from "./user/userReducer";
import noteReducer from "./note/noteReducer";
import bookmarkReducer from "./bookmark/bookmarkReducer";
import archiveReducer from "./archive/archiveReducer";
import locationReducer from "./location/locationReducer";

const rootReducer = {
    counter: counterReducer,
    archivalRecord: archivalRecordReducer,
    user: userReducer,
    note: noteReducer,
    bookmark: bookmarkReducer,
    archive: archiveReducer,
    location: locationReducer
}

export default rootReducer;