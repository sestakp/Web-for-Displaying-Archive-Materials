import React from "react"
import { Col } from "react-bootstrap";
import displayValue from "../../utils/displayValue";
import translateLabels from "../../utils/translateLabels";
import styles from "./DetailCell.module.scss"
import sanitizeHtml from 'sanitize-html';
import logger from "../../utils/loggerUtil";




interface DetailCellProps{
    name: string; 
    value: any;
    size: number;
    maxLenght?: number;
    minLenght: number;
}


const DetailCell: React.FC<DetailCellProps> = ({ name, value, size, maxLenght, minLenght }) => {
    const ignoredKeys = ["link", "id", "locations", "numberOfScans", "firstScan", "typeOfRecord", "isFavourite", "lastUpdated"]

    if(ignoredKeys.includes(name)){
        return <></>
    }

    let newValue = displayValue(value)
    if(newValue == "placeholder"){
        return <></>
    }
   
    if(( maxLenght !== undefined && newValue.length > maxLenght) || newValue.length < minLenght){
        return <></>
    }


    return(
        <Col md={size} key={name}>
            <div className={`${styles.infoCell}`}>
                <h3>{translateLabels(name)}</h3>
                {(name == "description" || name == "content") &&
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(newValue) }} />
                }
                {(name != "description" && name != "content" ) &&
                    <pre style={{maxWidth: "100%", textWrap: "wrap"}}><p>{newValue}</p></pre>
                }
            </div>
        </Col>
    )

}

export default DetailCell;