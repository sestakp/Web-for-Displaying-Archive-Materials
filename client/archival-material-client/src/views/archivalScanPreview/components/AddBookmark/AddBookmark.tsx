import { InputText } from "primereact/inputtext";
import styles from "./AddBookmark.module.scss"
import { Button } from "primereact/button";
import addBookmarkIcon from "../../../../assets/icons/add_bookmark_icon.png"
import useBookmarkActions from "../../../../store/bookmark/hooks/useBookmarkActionHook";
import { useEffect, useState } from "react";
import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import { useOpenSeadragonContext } from "../../../../context/OpenSeadragonContext";
import useBookmarkSelector from "../../../../store/bookmark/hooks/useBookmarkSelectorHook";
import Bookmark from "../../../../models/Bookmark/Bookmark";


const AddBookmark: React.FC = () => {

    const [bookmarkText, setBookmarkText] = useState<string>("");
    const bookmarkActions = useBookmarkActions();
    const bookmarkSelector = useBookmarkSelector()

    const archivalRecordSelector = useArchivalRecordSelector()
    const { pageIndex } = useOpenSeadragonContext();


    function getCurrentBookmark(){
        const url = archivalRecordSelector.detail?.scans?.[pageIndex];
        if(url !== undefined){
            return bookmarkSelector.data.find(bookmark => bookmark.scanUrl === url.url);

        }
    }

    let currentBookmark: Bookmark | undefined = getCurrentBookmark();
    
    useEffect(() => {
        
        if(currentBookmark !== undefined){
            setBookmarkText(currentBookmark.text);
        }
        else{
            setBookmarkText("");
        }
    }, [currentBookmark])

    function addBookmarkHandler(){

        const scan = archivalRecordSelector.detail?.scans?.[pageIndex];

        if(scan !== undefined){
            bookmarkActions.upsertBookmark(scan.url,bookmarkText)
        }

    }

    return (
        <div className={`${styles.addBookmarkContainer}`}>
            <h2 className={`${styles.header}`}>{currentBookmark !== undefined ? "Upravit" : "Přidat"} záložku</h2>
            <div style={{ display: "flex" }}>

                <InputText value={bookmarkText} onChange={(e) => setBookmarkText(e.target.value)} placeholder="Zde vložte název nové záložky" size="small" className={`${styles.input}`} />
                <Button icon={<img src={addBookmarkIcon} alt="addBookmarkIcon" className={`${styles.addBookmarkIcon}`}/>} size="small" className={`${styles.button}`} onClick={addBookmarkHandler}/>
            </div>
        </div>
    )

}

export default AddBookmark;