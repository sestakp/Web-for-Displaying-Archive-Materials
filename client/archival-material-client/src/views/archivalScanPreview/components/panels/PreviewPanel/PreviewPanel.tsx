import Loading from "../../../../../components/loading/Loading";
import { useOpenSeadragonContext } from "../../../../../context/OpenSeadragonContext";
import LoadingStatusEnum from "../../../../../models/LoadingStatusEnum";
import useArchivalRecordSelector from "../../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import isMobile from "../../../../../utils/isMobile";
import openLinkInNewTab from "../../../../../utils/openLinkInNewTab";
import Paginator from "../../Paginator/Paginator";
import Zoomer from "../../Zoomer/Zoomer";
import styles from "./PreviewPanel.module.scss"


const PreviewPanel: React.FC = () => {

    const archivalRecordSelector = useArchivalRecordSelector();

    
    const { viewer } = useOpenSeadragonContext();

    function isLoading() {
        console.log("is loading 1?: ", archivalRecordSelector.status === LoadingStatusEnum.LOADING)
        console.log("is loading 2?: ", viewer === undefined)
        return archivalRecordSelector.status === LoadingStatusEnum.LOADING || viewer === undefined
    }

    return (
        <>
            <div id="archive-viewer" className={`${styles.openseadragonContainer}`} >
                {isLoading() &&
                    <Loading />
                }
                
            </div>
            <div id="archive-viewer-buttons" style={{zIndex: 5}}>
                <div className={`${styles.link}`} onClick={() => openLinkInNewTab(archivalRecordSelector.detail?.link)}>
                    {archivalRecordSelector.detail?.link}
                </div>

                
                <Paginator />

                { ! isMobile() &&
                    <Zoomer />
                }
            </div>
        </>
    )

}

export default PreviewPanel;