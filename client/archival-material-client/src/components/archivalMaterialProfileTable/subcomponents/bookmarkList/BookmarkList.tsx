import { useEffect, useState } from "react";
import Bookmark from "../../../../models/Bookmark/Bookmark";
import { Col, Row } from "react-bootstrap";
import BookmarkCard from "../../../bookmarkCard/BookmarkCard";
import { Button } from "primereact/button";
import styles from "./BookmarkList.module.scss"
import logger from "../../../../utils/loggerUtil";
import Paper from "../../../Paper/Paper";
import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";




interface BookmarkListProps{
    bookmarks: Bookmark[];
}


const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks }) => {

    const archivalRecordSelector = useArchivalRecordSelector()
    const [page, setPage] = useState<number>(0);

    const [orderedBookmarks, setOrderedBookmarks] = useState<Bookmark[]>([])
    
    const maxPage = Math.ceil(bookmarks.length / 6)

    const pageSize = 6
    const startIndex = page * pageSize;

    useEffect(() => {
        let newBookmarks = bookmarks.map(bookmark => ({ ...bookmark }));

        for(var i = 0; i < newBookmarks.length; i++){
            const bookmark = newBookmarks[i]

            bookmark.pageNumber = archivalRecordSelector.detail?.scans?.findIndex(url => url.url == bookmark.scanUrl) ?? -1;
        }
        newBookmarks = newBookmarks.filter(b => b.pageNumber != -1)
        newBookmarks = newBookmarks.sort((a,b) => {
            if(a.pageNumber && b.pageNumber){
                return a.pageNumber - b.pageNumber;
            }
            return 0;
        })

        setOrderedBookmarks(newBookmarks)
    },[bookmarks])
    


    const visibleBookmarks = orderedBookmarks.slice(startIndex, startIndex + pageSize);


    function previousPage(){
        if(page > 0){
            setPage(oldPage => oldPage - 1)
        }
    }

    function nextPage(){
        if(page < maxPage - 1){
            setPage(oldPage => oldPage + 1)
        }
    }


    return(
        <div style={{cursor: "initial"}}>
            <Row style={{paddingLeft: "20px", paddingRight: "20px"}}>
                {visibleBookmarks.map(bookmark => 
                <Col xl={4} key={bookmark.id}>
                    <BookmarkCard bookmark={bookmark}/>
                </Col>)}
            </Row>
            {maxPage > 1 && 
                <div>
                    <div className={`${styles.paginator}`}>
                        <div >
                            <Paper style={{display: "flex", alignItems: "center", padding: "8px"}}>

                                <Button icon="pi pi-angle-left" onClick={() => {logger.debug("prev page"); previousPage()}} className={`${styles.button}`} />
                                <p>{page + 1} / {maxPage}</p>
                                <Button icon="pi pi-angle-right" onClick={() => {logger.debug("next page"); nextPage()}} className={`${styles.button}`} />
                            </Paper>
                        </div>
                    </div>
                </div>
            }
        </div>
    )

}

export default BookmarkList;