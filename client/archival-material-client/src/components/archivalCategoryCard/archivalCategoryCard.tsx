



import React from "react";
import styles from "./archivalCategoryCard.module.scss"
import { Card } from 'primereact/card';
import ArchivalCategory from "../../models/ArchivalCategory";
import { Link } from "react-router-dom";
import RoutesEnum from "../../layout/RoutesEnum";

interface ArchivalCategoryCardProps{
    archivalCategory: ArchivalCategory
}

const ArchivalCategoryCard: React.FC<ArchivalCategoryCardProps> = (props) => {

    return(
        <Link to={RoutesEnum.ARCHIVAL_MATERIAL+"/"+props.archivalCategory.linkName} className="link">
            <Card className={` ${styles.card}`}>
                <div className={styles.cardContainer}>

                    <img src={props.archivalCategory.icon} alt={`icon for ${props.archivalCategory.name}`} style={{width: "auto", height: "60px"}} />
                    <h2>{props.archivalCategory.name}</h2>
                    <span className="m-0">
                        {props.archivalCategory.description}
                    </span>
                </div>
            </Card>
        </Link>
    )
}

export default ArchivalCategoryCard;