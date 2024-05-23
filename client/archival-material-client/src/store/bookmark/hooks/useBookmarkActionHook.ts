import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks";
import BookmarkAction from "../bookmarkActions";


const useBookmarkActions = () => {

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const upsertBookmark = (url: string, data: string) => dispatch(BookmarkAction.upsertBookmark(navigate, url, data));
    const getBookmarks = (archivalRecordId: number) => dispatch(BookmarkAction.getBookmarks(navigate, archivalRecordId));
    const deleteBookmark = (bookmarkId: number) => dispatch(BookmarkAction.delete(navigate, bookmarkId));

    return { upsertBookmark, getBookmarks, deleteBookmark }
}

export default useBookmarkActions;