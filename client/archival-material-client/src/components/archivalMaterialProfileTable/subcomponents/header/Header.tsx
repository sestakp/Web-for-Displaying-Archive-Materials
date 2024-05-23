import React from "react";
import styles from "./Header.module.scss"
import { useParams } from "react-router-dom";
import categories from "../../../../configs/categories";


const Header: React.FC = () => {


    const { archivalMaterialCategory } = useParams();

    const category = categories.find(c => c.linkName == archivalMaterialCategory);

    return(
        <div className={styles.header}>
            <span className={styles.headerTextWrapper}>
                <img src={category?.icon} alt={`icon for ${category?.name}`} className={styles.icon} /> 
                {category?.name}
            </span>
        </div>
    )
}

export default Header;