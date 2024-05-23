import { Button } from "primereact/button";
import styles from "./TopMenu.module.scss"
import { useOpenSeadragonContext } from "../../../../context/OpenSeadragonContext";
import FullResolutionImageDownload from "../../../../utils/FullResolutionImageDownloadUtil";
import toastService from "../../../../utils/ToastUtil";
import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import { useNavigate } from "react-router-dom";
import DrawToolEnum from "../../../../models/DrawToolEnum";
import { Dropdown } from "primereact/dropdown";
import LayerEnum from "../../../../models/LayerEnum";
import formatNameShorter from "../../../../utils/formatters/formatNameShorter";
import { TooltipOptions } from "primereact/tooltip/tooltipoptions";
import { SpeedDial } from "primereact/speeddial";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHighlighter, faComments, faCompass, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Help from "../Help/Help";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";

const TopMenu: React.FC = () => {

    const [visible, setVisible] = useState<boolean>(false)

    const navigate = useNavigate()

    const { 
        rotateLeft, 
        rotateRight, 
        pageIndex, 
        reset, 
        toggleFullscreen, 
        togglePreserveViewport, 
        preserveViewport,
        toggleOverlayVisible,
        setActiveTool,
        isOverlayItemSelected,
        deleteSelectedNote,
        undo,
        redo,
        overlayVisible,
        setShowSettings,
        fullScreen,
        activeLayer,
        setActiveLayer,
        storeCurrentCanvas,
        setDisplayNavigation,
        setDisplayPreviews
    } = useOpenSeadragonContext();

    
    const archivalRecordSelector = useArchivalRecordSelector();

    function onClickAppName(){
        if(fullScreen){
            toggleFullscreen()
        } 
        storeCurrentCanvas(false)
        navigate("/")
    }

    const tooltipOptions: TooltipOptions = {
        position: "bottom"
    };

    const items = [];

    if(isOverlayItemSelected){

        items.push({
            label: 'Smazat poznámku',
            icon: 'pi pi-trash',
            command: () => {
                deleteSelectedNote()
            }
        })
    }

    if(overlayVisible){
        items.push({
            label: 'Zvýrazňění',
            icon: <FontAwesomeIcon icon={faHighlighter} />,
            command: () => {
                setActiveTool(DrawToolEnum.HIGHLIGHT)
            }
        })

        items.push({
                label: 'Kreslení',
                icon: 'pi pi-pencil',
                command: () => {
                    setActiveTool(DrawToolEnum.DRAW)
                }
        })

        items.push({
            label: 'Textová poznámka',
            icon: 'pi pi-align-left',
            command: () => {
                setActiveTool(DrawToolEnum.TYPE)
            }
        })
    }

    items.push({
        label: 'Pohyb po archiválii',
        icon: 'pi pi-arrows-alt',
        command: () => {
            setActiveTool(DrawToolEnum.MOVE)
        }
    })    
    
    /*if(overlayVisible){
        items.push({
            label: 'Redo',
            icon: <FontAwesomeIcon icon={faRotateRight} />,
            command: () => {
                
                setVisible(false)
                redo()
            }
        })  

        items.push({
            label: 'Undo',
            icon: <FontAwesomeIcon icon={faRotateLeft} />,
            command: () => {
                setVisible(false)
                undo()
            }
        })  
    }*/
       

    return (
        <div className={`${styles.topBarWrapper}`}>
            <div className={`${styles.topBar}`}>
                <div className={`${styles.topBarLeft}`}>
                    
                    <h2 className={`${styles.textBadge}`} onClick={onClickAppName} style={{ cursor: "pointer" }}>SearchArchiva</h2>
                    <Button icon="pi pi-replay" size="small" className={`${styles.controlButton}`} onClick={rotateLeft} tooltip="Otočit vlevo" tooltipOptions={tooltipOptions}/>
                    <Button icon="pi pi-refresh" size="small" className={`${styles.controlButton}`} onClick={rotateRight} tooltip="Otočit vpravo (R)" tooltipOptions={tooltipOptions}/>
                    <Button icon={`pi ${preserveViewport ? "pi-lock" : "pi-lock-open"}`} size="small" className={`${styles.controlButton}`} onClick={togglePreserveViewport} tooltip="Zachovat zobrazení" tooltipOptions={tooltipOptions}/>
                    <Button icon="pi pi-window-maximize" size="small" className={`${styles.controlButton}`} onClick={toggleFullscreen} tooltip="Přepnutí zobrazení na celou obrazovku (F)" tooltipOptions={tooltipOptions}/>
                    <Button icon="pi pi-home" size="small" className={`${styles.controlButton}`} onClick={reset} tooltip="Výchozí velikost" tooltipOptions={tooltipOptions}/>
                    <Button icon="pi pi-download" size="small" className={`${styles.controlButton}`} onClick={() => toastService.promiseToast(FullResolutionImageDownload(archivalRecordSelector.detail, pageIndex), "Probíhá stahování a kompletace skenu do plné velikosti (průměrně několik desítek vteřin)")} tooltip="Stažení snímku" tooltipOptions={tooltipOptions}/>
                    <Button icon="pi pi-cog" size="small" disabled={ fullScreen} className={`${styles.controlButton}`} onClick={() => setShowSettings((old: boolean) => !old)} tooltip="Přepnutí zobrazení nastavení" tooltipOptions={tooltipOptions}/>
                    <Button icon={<FontAwesomeIcon icon={faCompass} />} size="small" className={`${styles.controlButton}`} onClick={() => setDisplayNavigation((old: boolean) => !old)} tooltip="Přepnutí zobrazení navigace" tooltipOptions={tooltipOptions}/>
                    <Button icon={<FontAwesomeIcon icon={faEllipsisVertical} />} size="small" className={`${styles.controlButton}`} onClick={() => setDisplayPreviews((old: boolean) => !old)} tooltip="Přepnutí zobrazení náhledů dalších snímků" tooltipOptions={tooltipOptions}/>
                    <Button icon={overlayVisible ? <FontAwesomeIcon icon={faComments} /> : "pi pi-comments"} size="small" className={`${styles.controlButton}`} onClick={toggleOverlayVisible} tooltip="Přepnutí zobrazení poznámek a přepisů" tooltipOptions={tooltipOptions}/>
                    {
                        overlayVisible &&
                        <Dropdown value={activeLayer} onChange={(e) => setActiveLayer(e.value)} options={[LayerEnum.PUBLIC, LayerEnum.PRIVATE]} style={{ height: "30px", lineHeight: "0.5"}} />
                    }
                </div>
                <span className={`${styles.textBadge}`} style={{maxWidth: "700px"}}>
                        {formatNameShorter(archivalRecordSelector.detail)}
                </span>
                <div style={{display: "flex", alignItems: "center"}}>
                    {/*
                        <Button icon="pi pi-arrows-alt" size="small" onClick={() => setActiveTool(DrawToolEnum.MOVE)} className={`${styles.controlButton}`} tooltip="Pohyb po archiválii" tooltipOptions={tooltipOptions}/>
                        <Button icon="pi pi-align-left" size="small" disabled={ ! overlayVisible} onClick={() => setActiveTool(DrawToolEnum.TYPE)} className={`${styles.controlButton}`} tooltip="Textová poznámka" tooltipOptions={tooltipOptions}/>
                        <Button icon="pi pi-pencil" size="small" disabled={ ! overlayVisible} onClick={() => setActiveTool(DrawToolEnum.DRAW)} className={`${styles.controlButton}`} tooltip="Kreslení" tooltipOptions={tooltipOptions}/>
                        <Button icon={<img src={markerIcon} alt="markerIcon" style={{width: "16px", filter: "invert(100%)"}}/>} size="small" disabled={ ! overlayVisible} onClick={() => setActiveTool(DrawToolEnum.HIGHLIGHT)} className={`${styles.controlButton}`} tooltip="Zvýrazňění" tooltipOptions={tooltipOptions}/>
                        <Button icon="pi pi-trash" size="small" disabled={ ! isOverlayItemSelected} onClick={deleteSelectedNote} className={`${styles.controlButton}`} tooltip="Smazat poznámku" tooltipOptions={tooltipOptions}/>
                    */}
                    { ! visible &&
                        <>
                            <Button icon="pi pi-undo" size="small" disabled={ ! overlayVisible} onClick={undo} className={`${styles.controlButton}`} tooltip="Undo" tooltipOptions={tooltipOptions}/>
                            <Button icon="pi pi-undo" size="small" disabled={ ! overlayVisible} onClick={redo} style={{ transform: 'scaleX(-1)' }} className={`${styles.controlButton}`} tooltip="Redo" tooltipOptions={tooltipOptions}/>
                                
                            <Help />
                        </>
                    }

                    <Tooltip target=".speedial-button-right .p-speeddial-button" position="bottom" content="Nástroje pro tvorbu poznámek" />
                    
                    <SpeedDial 
                    pt={{
                        menu: () => ({
                            style: {
                                //position: "absolute",
                                //zIndex: 0,
                                display: visible ? "flex" : "none"
                            }
                        }),

                        action: (state) => ({
                            style: {
                                //position: "absolute",
                                //zIndex: 0,
                                backgroundColor: "#1985A1",
                                color: "#FAFAFA"
                            },
                            ...state
                        }),
                    }}
                    visible={visible}
                    onHide={() => setVisible(false)}
                    onShow={() => setVisible(true)}
                    //onClick={() => { logger.debug("toggle visibility"); setVisible(old => ! old)}}
                    buttonClassName={`${styles.speedDialButton}`} model={items} radius={200} className="speedial-button-right" direction="left" style={{/*zIndex: "999", right: "135px", top: "12px"*/ position: "relative"}}/>

                </div>
                

            </div>
        </div>
    )

}

export default TopMenu;