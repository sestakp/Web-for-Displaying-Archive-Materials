import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import ArchivalMaterialDetailPanel from "../../../archivalMaterialDetailPanel/archivalMaterialDetailPanel"
import useNoteActions from "../../../../store/note/hooks/noteActionHook";
import useNoteSelector from "../../../../store/note/hooks/noteSelectorHook";
import useBookmarkActions from "../../../../store/bookmark/hooks/useBookmarkActionHook";
import useBookmarkSelector from "../../../../store/bookmark/hooks/useBookmarkSelectorHook";
import { useEffect } from "react";
import useArchivalRecordActions from "../../../../store/archivalRecord/hooks/archivalRecordActionHook";
import BookmarkList from "../bookmarkList/BookmarkList";


const ExpandedRow: React.FC<any> = (data) => {

    console.log("Expanded row: ", data)
    const archivalRecordActions = useArchivalRecordActions()
    const archivalRecordSelector = useArchivalRecordSelector()
    
    const noteActions = useNoteActions()
    const noteSelector = useNoteSelector()
    
    const bookmarkActions = useBookmarkActions()
    const bookmarkSelector = useBookmarkSelector()

    useEffect(() => {
        if(archivalRecordSelector.onlyWithBookmarks){
            bookmarkActions.getBookmarks(data.id)
            archivalRecordActions.getScans(data.id)
        }
    },[archivalRecordSelector.onlyWithBookmarks])

    useEffect(() => {
        if(archivalRecordSelector.onlyWithNotes){
            archivalRecordActions.getScans(data.id)
            noteActions.getNotes(data.id)
        }
    },[archivalRecordSelector.onlyWithNotes])


    function formatNotes(){
        let notesStr = ""

        let indexes = []


        const notes = [...noteSelector.notes]

        for(let i = 0; i < notes.length; i++){
            const note = notes[i];

            let scanIndex = archivalRecordSelector.detail?.scans?.findIndex(url => url.url == note.scanUrl) ?? -1;
            
            
            if(scanIndex != -1){
               indexes.push(scanIndex)
            }
        }

        indexes = indexes.sort()


        for(let i = 0; i < indexes.length; i++){
            if(indexes[i] != undefined){
                notesStr += (indexes[i] + 1) + ", "
            }
        }

        if(notesStr.length > 1){
            notesStr = notesStr.slice(0,-2);
        }
        return notesStr;
    }

    if(archivalRecordSelector.onlyWithBookmarks){
        return(
            <BookmarkList bookmarks={bookmarkSelector.data} />
        )
    }

    if(archivalRecordSelector.onlyWithNotes){
        return(
            <div>
                <p>Poznámky na stránkách: {formatNotes()}</p>
            </div>
            )
    }

    return(
        <ArchivalMaterialDetailPanel archivalMaterialId={data.id} />
    )
}

export default ExpandedRow;