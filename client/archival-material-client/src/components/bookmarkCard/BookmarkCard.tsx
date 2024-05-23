import Bookmark from "../../models/Bookmark/Bookmark";
import useArchivalRecordSelector from "../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import dateFormatter from "../../utils/formatters/dateFormatter";
import Paper from "../Paper/Paper";
import pageIcon from "../../assets/icons/page_icon.png"
import styles from "./BookmarkCard.module.scss"
import useBookmarkActions from "../../store/bookmark/hooks/useBookmarkActionHook";
import toastService from "../../utils/ToastUtil";
import { confirmPopup } from "primereact/confirmpopup";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

interface BookmarkCardProps{
    bookmark: Bookmark
}


const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark }) => {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [editedValue, setEditedValue] = useState<string>(bookmark.text) 
    const archivalRecordSelector = useArchivalRecordSelector()

    const bookmarkActions = useBookmarkActions()

    let scanIndex = archivalRecordSelector.detail?.scans?.findIndex(url => url.url == bookmark.scanUrl) ?? -1;


    const accept = () => {
        if(bookmark.id != undefined){
            bookmarkActions.deleteBookmark(bookmark.id)
        }
    };

    const reject = () => {

    };
    
    const confirmDelete = (event: any) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Opravdu si přejete smazat záložku?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'reject',
            accept,
            reject,
            acceptLabel: 'Smazat',
            rejectLabel: 'Zrušit'
        });
    };


    function toggleEditMode(){

        if(editMode){
            setEditMode(false)
            setEditedValue(bookmark.text)
        }
        else{
            setEditMode(true)
        }
    }


    function updateBookmark(){
        bookmarkActions.upsertBookmark(bookmark.scanUrl, editedValue)
        setEditMode(false)
    }


    return(
        <Paper style={{cursor: "initial"}}>
            
            <div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div>
                    {scanIndex != -1 &&
                        <>
                        <img src={pageIcon} style={{width: "auto", height: "16px"}}/>
                        {scanIndex + 1}
                        </>
                    }
                    <i className={`pi pi-clock ${styles.clock}`} /><span>{dateFormatter(bookmark.lastUpdated)}</span>
                    
                    
                    </div>
                    <div>
                        { ! editMode &&
                            <i className={`pi pi-pencil ${styles.pencil}`} onClick={toggleEditMode}/>
                        }
                        
                        <i className={`pi pi-trash ${styles.trash}`} onClick={confirmDelete}/>                        
                    </div>
                </div>
                <div>
                    {editMode &&
                        <div style={{paddingTop: "5px"}}>
                            <InputText value={editedValue} onChange={(e: any) => setEditedValue(e.target.value)} />
                            <i className={`pi pi-save ${styles.save}`} onClick={updateBookmark}/>
                            <i className={`pi pi-times ${styles.icon}`} onClick={toggleEditMode}/>

                        </div>
                    }
                    { ! editMode &&
                        <p><b>Název:</b> <span>{bookmark.text}</span></p>
                    }
                </div>
                
            </div>
        </Paper>
    )
}

export default BookmarkCard;