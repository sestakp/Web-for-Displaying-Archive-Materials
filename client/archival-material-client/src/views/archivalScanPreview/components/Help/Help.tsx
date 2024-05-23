import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useState } from "react";
import styles from "./Help.module.scss"
import { TooltipOptions } from "primereact/tooltip/tooltipoptions";
import Keyboard from "../../../../components/keyboard/Keyboard";
import useKeyboardShortcut from "../../../../hooks/useKeyboardShortcut/useKeyboardShortcut";
import { useOpenSeadragonContext } from "../../../../context/OpenSeadragonContext";



const Help = () => {

    const [visible, setVisible] = useState<boolean>(false);
    
    useKeyboardShortcut('h', () => setVisible(old => !old));

    const tooltipOptions: TooltipOptions = {
        position: "bottom"
    };

    return(
        <>
        <Button icon="pi pi-question" size="small"  onClick={() => setVisible(true)} className={`${styles.controlButton}`} tooltip="Nápověda (H)" tooltipOptions={tooltipOptions}/>
                    
        <Dialog header="Nápověda" visible={visible} onHide={() => setVisible(false)}
            style={{ width: '90vw' }}>
            
            <Keyboard />
        </Dialog>
        </>
    )
}

export default Help