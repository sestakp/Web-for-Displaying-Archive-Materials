import { useNavigate, useParams } from "react-router-dom";
import ArchivalRecordList from "../../../../models/ArchivalRecord/ArchivalRecordList";
import styles from "./OtherArchivalMaterialRow.module.scss"
import RoutesEnum from "../../../../layout/RoutesEnum";
import formatName from "../../../../utils/formatters/formatName";
import formatYear from "../../../../utils/formatters/formatYear";
import formatDescription from "../../../../utils/formatters/formatDescription";
import React, { MouseEvent } from "react";
import ArchivalMaterialDetailPanel from "../../../archivalMaterialDetailPanel/archivalMaterialDetailPanel";
import useArchivalRecordActions from "../../../../store/archivalRecord/hooks/archivalRecordActionHook";
import ExpandedRow from "../expandedRow/expandedRow";


interface OtherArchivalMaterialRowProps{
    record: ArchivalRecordList
    expandedRow: any
    setExpandedRow: any
}

const OtherArchivalMaterialRow: React.FC<OtherArchivalMaterialRowProps> = ({ record, expandedRow, setExpandedRow }) => {

    const navigate = useNavigate()
    const { archivalMaterialCategory } = useParams();

    const archivalRecordActions = useArchivalRecordActions()

    function onClick(){
        navigate(`${RoutesEnum.ARCHIVAL_MATERIAL}/${archivalMaterialCategory}/${record.id}`)
    }


    function toggleExpandedRow(e: MouseEvent){
        e.preventDefault()
        e.stopPropagation()
        
        if(expandedRow != undefined && expandedRow.id == record.id){
            setExpandedRow(undefined)
        }
        else{
            
            archivalRecordActions.getArchivalRecordById(record.id)
            setExpandedRow(record)
        }
    }

    return(
        <div className={`${styles.rowWrapper}`} >
            <div onClick={onClick}>
                <div className={`${styles.firstRow}`}>
                    <p className={`${styles.name}`}>{formatName(record)}</p>
                    <p className={`${styles.year}`}>{formatYear(record)}</p>
                </div>
                <div style={{display: "flex", alignItems: "center"}}>
                    <div onClick={toggleExpandedRow} className={styles.expandIcon}>
                        <i className={expandedRow?.id == record.id ? "pi pi-angle-down" : "pi pi-angle-right"} style={{fontSize: "20px", color: "#6b7280", marginLeft: "12px"}}/>
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
            </div>
            
            {expandedRow?.id == record.id &&
                <>
                {/*<ArchivalMaterialDetailPanel archivalMaterialId={record.id} />*/}
                <ExpandedRow {...record}/>
                </>
            }
        </div>
    )

}

export default OtherArchivalMaterialRow;