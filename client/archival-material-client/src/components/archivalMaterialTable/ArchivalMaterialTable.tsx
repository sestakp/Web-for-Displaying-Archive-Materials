import React, { useEffect } from "react";
import styles from "./ArchivalMaterialTable.module.scss"
import Header from "./subcomponents/header/Header";
import Table from "./subcomponents/table/Table";
import Footer from "./subcomponents/footer/Footer";
import TypeOfRecordEnum from "../../models/TypeOfRecordEnum";

interface ArchivalMaterialTableProps{
    typeOfRecord?: TypeOfRecordEnum
}

const ArchivalMaterialTable: React.FC<ArchivalMaterialTableProps> = ({ typeOfRecord }) => {

    return(
        <div className={`${styles.tableContainer}`}>
            <Header typeOfRecord={typeOfRecord}/>
            <Table typeOfRecord={typeOfRecord}/>
            <Footer />
        </div>
    )
}

export default ArchivalMaterialTable;