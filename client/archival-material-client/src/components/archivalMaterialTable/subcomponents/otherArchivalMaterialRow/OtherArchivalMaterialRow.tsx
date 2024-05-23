import { useNavigate, useParams } from "react-router-dom";
import ArchivalRecordList from "../../../../models/ArchivalRecord/ArchivalRecordList";
import styles from "./OtherArchivalMaterialRow.module.scss"
import RoutesEnum from "../../../../layout/RoutesEnum";
import formatName from "../../../../utils/formatters/formatName";
import formatYear from "../../../../utils/formatters/formatYear";
import formatDescription from "../../../../utils/formatters/formatDescription";
import logger from "../../../../utils/loggerUtil";
import React, { Ref, useRef } from "react";


interface OtherArchivalMaterialRowProps{
    record: ArchivalRecordList
    cm: any
    setSelectedRecord: any
}

const OtherArchivalMaterialRow: React.FC<OtherArchivalMaterialRowProps> = ({ record, cm, setSelectedRecord }) => {

    const navigate = useNavigate()
    const { archivalMaterialCategory } = useParams();
    


    function onClick(event: any){
        
        navigate(`${RoutesEnum.ARCHIVAL_MATERIAL}/${archivalMaterialCategory}/${record.id}`)
    }

    const onContextMenu = (event: any) => {
        // Open link in a new window when the mouse wheel is clicked
        //window.open(`${RoutesEnum.ARCHIVAL_MATERIAL}/${archivalMaterialCategory}/${record.id}`, "_blank");
        console.log("its right click: ", event)
        
        event.nativeEvent.preventDefault();
        event.nativeEvent.stopPropagation();
        setSelectedRecord(record)
        cm?.current.show(event)
    
    };

    return(
        <div className={`${styles.rowWrapper}`} onClick={onClick} onContextMenu={onContextMenu} >
            <div className={`${styles.firstRow}`}>
                <p className={`${styles.name}`}>{formatName(record)}</p>
                <p className={`${styles.year}`}>{formatYear(record)}</p>
            </div>
            <p className={`${styles.description}`}>
                {formatDescription(record)?.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                ))}
            </p>
        </div>
    )

}

export default OtherArchivalMaterialRow;