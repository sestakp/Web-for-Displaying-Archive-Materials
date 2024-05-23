import React, { useEffect } from "react";
import styles from "./archivalMaterialProfileTable.module.scss"
import Header from "./subcomponents/header/Header";
import Table from "./subcomponents/table/Table";
import Footer from "./subcomponents/footer/Footer";

const ArchivalMaterialProfileTable: React.FC = () => {



    return(
        <div className={`${styles.tableContainer}`}>
            <Table />
            <Footer />
        </div>
    )
}

export default ArchivalMaterialProfileTable;