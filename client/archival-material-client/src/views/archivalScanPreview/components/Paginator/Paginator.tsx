
import { Button } from "primereact/button";
import styles from "./Paginator.module.scss"
import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import { useOpenSeadragonContext } from "../../../../context/OpenSeadragonContext";
import { InputNumber } from "primereact/inputnumber";
import isMobile from "../../../../utils/isMobile";






const Paginator: React.FC = () => {

    
    const archivalRecordSelector = useArchivalRecordSelector();

    const {previousPage, nextPage, pageIndex, goToPage } = useOpenSeadragonContext();

    return (
        <div className={`${styles.paginator}`}>
            <Button icon="pi pi-angle-left" onClick={previousPage} className={`${styles.button}`} />
            { isMobile() &&
                <p>{pageIndex + 1} / {archivalRecordSelector.detail?.scans?.length}</p>
            }
            { ! isMobile() &&
                <>
                <InputNumber 
                    className={`${styles.inputNumber}`} 
                    inputStyle={{ width: "50px", padding: "4px", marginLeft: "8px" }} 
                    min={1} 
                    max={archivalRecordSelector.detail?.scans?.length} 
                    value={pageIndex + 1} 
                    onChange={e => goToPage((e.value ?? 0) - 1)}
                />
                <p> / {archivalRecordSelector.detail?.scans?.length}</p>
                </>
            }
            
            <Button icon="pi pi-angle-right" onClick={nextPage} className={`${styles.button}`} />
        </div>
    )
}

export default Paginator;