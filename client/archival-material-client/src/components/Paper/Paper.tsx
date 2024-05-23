import React from "react";
import styles from "./Paper.module.scss"

interface PaperProps {
    children: React.ReactNode;
    className?: string;
    style?: any
}

const Paper: React.FC<PaperProps> = (props) => {



    return(
        <div className={`${styles.paperContainer} ${props.className}`} style={props.style}>
            {props.children}
        </div>
    )
}

export default Paper;