import React from "react";
import styles from "./Header.module.scss"
import { useParams } from "react-router-dom";
import categories from "../../../../configs/categories";
import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import TypeOfRecordEnum from "../../../../models/TypeOfRecordEnum";


interface HeaderProps {
    typeOfRecord?: TypeOfRecordEnum
}
const Header: React.FC<HeaderProps> = ({ typeOfRecord }) => {

    const archivalRecordSelector = useArchivalRecordSelector()


    const { archivalMaterialCategory } = useParams();

    const category = categories.find(c => c.linkName == archivalMaterialCategory || (typeOfRecord != undefined && c.type == typeOfRecord));

    
    return(
        <div className={styles.header}>
            <span className={styles.headerTextWrapper}>
                <img src={category?.icon} alt={`icon for ${category?.name}`} className={styles.icon} /> 
                {category?.name}
            </span>
            <span style={{textAlign: "right"}}>
                Celkem nalezeno {archivalRecordSelector.totalElements} záznamů
            </span>
        </div>
    )
}

export default Header;