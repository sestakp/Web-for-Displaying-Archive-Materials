import { TabPanel, TabView } from "primereact/tabview";
import DetailCell from "../detailCell/DetailCell";
import styles from "./archivalMaterialDetailPanel.module.scss"
import Map from "../map/Map";
import useArchivalRecordSelector from "../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import Loading from "../loading/Loading";
import { useNavigate } from "react-router-dom";
import RoutesEnum from "../../layout/RoutesEnum";
import museumIcon from "../../assets/icons/icon_museum.png";
import photoIcon from "../../assets/icons/photo_icon.png";
import openLinkInNewTab from "../../utils/openLinkInNewTab";
import { Button } from "primereact/button";
import { Col, Row } from "react-bootstrap";
import dateFormatter from "../../utils/formatters/dateFormatter";
import { useEffect, useState } from "react";


interface ArchivalMaterialDetailPanelProps{
    archivalMaterialId: number
}


const ArchivalMaterialDetailPanel: React.FC<ArchivalMaterialDetailPanelProps> = ({ archivalMaterialId }) => {

    const [forceUpdate, setForceUpdate] = useState<number>(0);

    const archivalRecordSelector = useArchivalRecordSelector()

    const navigate = useNavigate()

    useEffect(() => {

        async function asyncUseEffect(){
            if(archivalRecordSelector?.detail?.firstScan != undefined){
                if(archivalRecordSelector?.detail?.firstScan.preFetchUrl != undefined && archivalRecordSelector?.detail?.firstScan.preFetchUrl != ""){
                    const preFetchUrl = `${process.env.REACT_APP_PROXY_URL}/proxy?url=${archivalRecordSelector?.detail?.firstScan.preFetchUrl}`;
                    await fetch(preFetchUrl)
                    setForceUpdate(old => old + 1);
                }
            }
        }

        asyncUseEffect();
    },[archivalRecordSelector?.detail?.firstScan])

    if(archivalRecordSelector.detail == undefined){
        return <Loading />
    }

    let url : string | undefined = undefined
    if(archivalRecordSelector.detail.firstScan != undefined){

        if(archivalRecordSelector.detail?.archive?.name == "Státní oblastní archiv v Hradci Králové"){
            url = `${process.env.REACT_APP_PROXY_URL}/proxy?url=${archivalRecordSelector.detail.firstScan.url.replace(".dzi", "_files/8/0_0.jpg")}`;
        }
        else{
            url = `${process.env.REACT_APP_PROXY_URL}/proxy?url=${archivalRecordSelector.detail.firstScan.url.replace(".dzi", "_files/0/0_0.jpg")}`;
        }
        
        url = url.replace("/dzc_output_images/dzsource.xml", "/dzc_output_images/dzsource_files/8/0_0.jpg")
    }

    


    return (
        <>
            <TabView className={styles.tabView}>
                    <TabPanel header="Informace">
                        <Row>
                            <Col md={9}>
                                <Row>
                                        {Object.entries(archivalRecordSelector.detail)?.map(([key, value]) => {
                                            
                                            return(                                                
                                                <DetailCell key={key} name={key} value={value} size={3} maxLenght={50} minLenght={0} />
                                            )
                                        })}
                                </Row>
                                <Row>
                                        {Object.entries(archivalRecordSelector.detail)?.map(([key, value]) => {
                                            
                                            return(                                                
                                                <DetailCell key={key} name={key} value={value} size={12} minLenght={51} />
                                            )
                                        })}
                                </Row>
                            </Col>  
                            <Col md={3} style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center"}}>
                                
                                <div style={{width: "60%"}}>
                                    {url != undefined &&
                                        <>
                                            <div style={{position: "relative", cursor: "pointer"}} onClick={() => navigate(`${RoutesEnum.ARCHIVAL_MATERIAL_PREVIEW}/${archivalMaterialId}/1`)}>
                                                <img src={url} style={{width: "100%"}}/>

                                                <p className={`${styles.imgNumberOfScansOverlay}`}>{archivalRecordSelector.detail.numberOfScans} snímků</p>
                                            </div>
                                            <Button icon={<img src={photoIcon} style={{width: "32px"}}/>} label="Zobrazit v prohlížeči" onClick={() => navigate(`${RoutesEnum.ARCHIVAL_MATERIAL_PREVIEW}/${archivalMaterialId}/1`)} style={{marginTop: "10px", marginBottom: "10px" }} className={`${styles.button}`}/>
                                        </>
                                    }
                                    
                                    { (archivalRecordSelector.detail?.link != undefined && archivalRecordSelector.detail?.link != "") &&
                                        <Button icon={<img src={museumIcon} style={{width: "32px"}}/>} label="Zobrazit na stránkách archivu" onClick={() => openLinkInNewTab(archivalRecordSelector.detail?.link)} className={`${styles.button}`}/>
                                    }
                                    
                                </div>
                                
                            </Col>
                        </Row>
                        
                    </TabPanel>
                    <TabPanel header="Územní rozsah">
                        <Map />
                    </TabPanel>
                </TabView>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    Naposledy aktualizováno: {dateFormatter(archivalRecordSelector.detail.lastUpdated)}
                </div>
        </>
    )
}

export default ArchivalMaterialDetailPanel;