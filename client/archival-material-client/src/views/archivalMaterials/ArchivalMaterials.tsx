import React, { useEffect, useMemo } from "react";

import styles from "./ArchivalMaterials.module.scss"
import ArchivalMaterialTable from "../../components/archivalMaterialTable/ArchivalMaterialTable";
import Paper from "../../components/Paper/Paper";
import { BreadCrumb } from "primereact/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import categories from "../../configs/categories";
import ArchivalCategory from "../../models/ArchivalCategory";
import FullTextSearch from "../../components/fullTextSearch/FullTextSearch";
import useArchivalRecordActions from "../../store/archivalRecord/hooks/archivalRecordActionHook";
import TypeOfRecordEnum from "../../models/TypeOfRecordEnum";

const ArchivalMaterials: React.FC = () => {

    const navigate = useNavigate()

    const archivalMaterialActions = useArchivalRecordActions()

    const { archivalMaterialCategory } = useParams();

    const category: ArchivalCategory = useMemo(() => categories.find((c) => c.linkName === archivalMaterialCategory) || {} as ArchivalCategory, [archivalMaterialCategory]);

    useEffect(() => {
        archivalMaterialActions.setOnlyFavourites(false);
        archivalMaterialActions.setOnlyWithBookmarks(false);
        archivalMaterialActions.setOnlyWithNotes(false);

        if(category.type != TypeOfRecordEnum.OBEC){
            archivalMaterialActions.setTypeOfRecord(category.type);
        }
        else{
            archivalMaterialActions.setTypeOfRecord(undefined);
        }
        
    },[category])

    const items = useMemo(() => [{ icon: category?.icon, label: category?.name }], [category]);
  
    const home = useMemo(() => ({ icon: 'pi pi-home', command: () => navigate(`/`) }), [navigate]);

    return(
        <Paper>
            <>
            <BreadCrumb model={items} home={home} className={styles.breadcrumb}/>

            <FullTextSearch />
            {/*
            <div className={`${styles.filterWrapper}`}>
                <span className={`p-float-label ${styles.inputWrapper}`}>
                    <InputText id="region" value={value} onChange={(e) => setValue(e.target.value)} className={styles.input}/>
                    <label htmlFor="region">Kraj</label>
                </span>
                <span className={`p-float-label ${styles.inputWrapper}`}>
                    <InputText id="district" value={value} onChange={(e) => setValue(e.target.value)} className={styles.input}/>
                    <label htmlFor="district">Okres</label>
                </span>
            </div>
            */}
            <div className={`${styles.tableWrapper}`}>
                <ArchivalMaterialTable />
            </div>
            </>
        </Paper>
    )
}

export default ArchivalMaterials;