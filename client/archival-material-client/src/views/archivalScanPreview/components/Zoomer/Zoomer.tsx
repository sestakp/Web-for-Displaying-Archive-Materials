import { Button } from "primereact/button";
import styles from "./Zoomer.module.scss"
import formatToPercentString from "../../../../utils/formatters/formatToPercentString";
import { useOpenSeadragonContext } from "../../../../context/OpenSeadragonContext";



const Zoomer: React.FC = () => {

    const {zoomOut, zoomIn, zoom } = useOpenSeadragonContext();

    return (
        <div className={`${styles.zoomer}`}>
            <Button icon="pi pi-search-minus" onClick={zoomOut} className={`${styles.button}`} />
            <p>{formatToPercentString(zoom)}</p>
            <Button icon="pi pi-search-plus" onClick={zoomIn} className={`${styles.button}`} />
        </div>
    )
}

export default Zoomer