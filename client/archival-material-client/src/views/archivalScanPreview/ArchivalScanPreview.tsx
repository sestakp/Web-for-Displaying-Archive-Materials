import React, { useEffect } from "react";
import styles from "./ArchivalScanPreview.module.scss"
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useParams } from "react-router-dom";
import useArchivalRecordActions from "../../store/archivalRecord/hooks/archivalRecordActionHook";
import useArchivalRecordSelector from "../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import Bookmarks from "./components/Bookmarks/Bookmarks";
import { useOpenSeadragonContext } from "../../context/OpenSeadragonContext";
import TopMenu from "./components/TopMenu/TopMenu";
import FilterPanel from "./components/panels/FilterPanel/FilterPanel";
import PreviewPanel from "./components/panels/PreviewPanel/PreviewPanel";
import useNoteActions from "../../store/note/hooks/noteActionHook";
import useBookmarkActions from "../../store/bookmark/hooks/useBookmarkActionHook";
import isMobile from "../../utils/isMobile";

const ArchivalScanPreview: React.FC = () => {


    const { initializeViewer, showSettings, destroyViewer, fullScreen, displayNavigation, displayPreviws } = useOpenSeadragonContext();

    const id = Number(useParams().archivalMaterialId);

    const archivalRecordActions = useArchivalRecordActions();
    const archivalRecordSelector = useArchivalRecordSelector();

    const bookmarkActions = useBookmarkActions();
    const noteActions = useNoteActions();

    useEffect(() => {

        if (archivalRecordSelector.detail == undefined || archivalRecordSelector.detail.id != id) {
            archivalRecordActions.getArchivalRecordById(id)
        }
        else {
            initializeViewer(archivalRecordSelector.detail?.scans)
        }

        return () => {
            destroyViewer()
        }
    }, [id, archivalRecordSelector.detail, showSettings, fullScreen])
      
    
    useEffect(() => {
        archivalRecordActions.getScans(id);
        noteActions.getNotes(id);
        bookmarkActions.getBookmarks(id);
    }, [id])

    if(isMobile()){
        return (
            <div style={{width: "100%", height: "100vh"}}>
                <PreviewPanel />
            </div>
        )
    }

    return (

        <div className={`${styles.main}`}>
            
            
            <TopMenu />

            <div style={{ display: "flex", flexDirection: "row" }}>
                { ! fullScreen && 
                    <div className={`${styles.panel}`} style={{ width: "80px", alignItems: "center" }}>
                        <Bookmarks />
                    </div>
                }
                

                {(showSettings && ! fullScreen) &&
                    <Splitter className={`${styles.splitter}`}>
                        <SplitterPanel className={`${styles.panel}`} style={{ position: "relative" }} size={85} minSize={40}>
                            <PreviewPanel />
                        </SplitterPanel>

                        <SplitterPanel className={`${styles.panel}`} size={15}>
                            <FilterPanel />
                        </SplitterPanel>
                    </Splitter>
                }

                { (! showSettings || fullScreen) &&
                    <div style={{width: "100%", height: "90vh"}}>

                        <PreviewPanel />
                    </div>
                }

            </div>
        </div>
    )
}

export default ArchivalScanPreview;