import { Button } from "primereact/button"
import styles from "./Bookmarks.module.scss"
import useBookmarkSelector from "../../../../store/bookmark/hooks/useBookmarkSelectorHook"
import Bookmark from "../../../../models/Bookmark/Bookmark"
import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook"
import { useOpenSeadragonContext } from "../../../../context/OpenSeadragonContext"


const Bookmarks: React.FC = () => {

    const bookmarkSelector = useBookmarkSelector()

    const archivalRecordSelector = useArchivalRecordSelector()

    const { goToPage } = useOpenSeadragonContext()


    function handleBookmarkClick(bookmark: Bookmark){
        if(archivalRecordSelector.detail?.scans !== undefined){

            const index = archivalRecordSelector.detail.scans.findIndex((scan) => scan.url === bookmark.scanUrl);
            if(index > -1){
                goToPage(index);
            }
        }
    }

    if(bookmarkSelector.data.length == 0){
        return <></>
    }

    return (
        <div className={`${styles.bookmarkWrapper}`}>
            {bookmarkSelector.data.map((bookmark, index) =>
                <Button key={index} tooltip={bookmark.text} icon="pi pi-bookmark" size="small" className={`${styles.bookmark} .bookmark-${index}`} onClick={() => handleBookmarkClick(bookmark)}/>
            )}
        </div>
    )
}

export default Bookmarks