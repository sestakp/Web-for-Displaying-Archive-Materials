import React, { useEffect, useRef, useState } from "react";
import { DataTable, DataTableRowClassNameOptions, DataTableRowMouseEvent, DataTableSortEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from "./Table.module.scss"
import Badge from "../../../badge/Badge";
import { useNavigate, useParams } from "react-router-dom";
import RoutesEnum from "../../../../layout/RoutesEnum";
import useArchivalRecordActions from "../../../../store/archivalRecord/hooks/archivalRecordActionHook";
import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import Loading from "../../../loading/Loading";
import LoadingStatusEnum from "../../../../models/LoadingStatusEnum";
import TypeOfRecordEnum from "../../../../models/TypeOfRecordEnum";
import LocationBadge from "../../../locationsBadge/LocationsBadge";
import formatTimeRange from "../../../../utils/formatters/formatTimeRange";
import OtherArchivalMaterialRow from "../otherArchivalMaterialRow/OtherArchivalMaterialRow";
import handleServerErrors from "../../../../utils/handleServerErrors";
import logger from "../../../../utils/loggerUtil";
import { ContextMenu } from "primereact/contextmenu";

interface TableProps {
    typeOfRecord?: TypeOfRecordEnum
}


const Table: React.FC<TableProps> = ({ typeOfRecord }) => {

    const archivalRecordActions = useArchivalRecordActions()
    const archivalRecordSelector = useArchivalRecordSelector()
    const [selectedRecord, setSelectedRecord] = useState<any>(undefined);
    const navigate = useNavigate()
    
    const cm = useRef<any>(undefined);
    const { archivalMaterialCategory } = useParams();

    const menuModel = [
        { label: 'Zobrazit v novém okně', icon: 'pi pi-external-link', command: () =>  window.open(`${RoutesEnum.ARCHIVAL_MATERIAL}/${archivalMaterialCategory}/${selectedRecord?.id}`, "_blank") },
    ];

   
    useEffect(() => {
        
        if (archivalRecordSelector.typeOfRecord != TypeOfRecordEnum.UNSET || typeOfRecord != undefined) {
            
            archivalRecordActions.fetchArchivalRecords(typeOfRecord)
        }
    }, [
        archivalRecordSelector.page,
        archivalRecordSelector.pageSize,
        archivalRecordSelector.textSearch,
        archivalRecordSelector.typeOfRecord,
        archivalRecordSelector.yearFrom,
        archivalRecordSelector.yearTo,
        archivalRecordSelector.archive,
        archivalRecordSelector.location,
        archivalRecordSelector.onlyFavourites,
        archivalRecordSelector.onlyWithBookmarks,
        archivalRecordSelector.onlyWithNotes,
        archivalRecordSelector.district,
        archivalRecordSelector.region,
        archivalRecordSelector.country,
        archivalRecordSelector.onlyDigitalized,
        archivalRecordSelector.sortField,
        archivalRecordSelector.sortOrder,
        typeOfRecord
    ])




    const onRowSelect = (event: DataTableRowMouseEvent) => {
        if (event.originalEvent.button === 1){
            logger.debug("middle click")
        }
        //logger.debug("Row clicked: ", event.data)
        navigate(`${RoutesEnum.ARCHIVAL_MATERIAL}/${archivalMaterialCategory}/${event.data.id}`)
    };

    const getRowClassName = (rowData: any, options: DataTableRowClassNameOptions<any[]>) => {
        return styles.datatableRow; // Custom class for rows
    };

    if (archivalRecordSelector.status == LoadingStatusEnum.LOADING) {
        return <Loading />
    }

    if(archivalRecordSelector.typeOfRecord != TypeOfRecordEnum.MATRIKA && typeOfRecord != TypeOfRecordEnum.MATRIKA){
        return (
            <div className={styles.tableWrapper}>
                <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedRecord(null)} />
                {archivalRecordSelector.data.map(record =>
                    <OtherArchivalMaterialRow key={record.id} record={record} cm={cm} setSelectedRecord={setSelectedRecord}/>
                )}
                {archivalRecordSelector.data.length == 0 &&
                    <p>Žádné výsledky nebyly nalezeny</p>
                }
            </div>
        )
    }

    function translateSortField(field: string | undefined){
        
        if(field == undefined){
            return undefined;
        }

        switch(field){
            case "archive":
                return "archive.name"
            case "originator":
                return "originator.name"
            case "yearBorn":
                return "yearBorn.from"
            case "yearMarried":
                return "yearMarried.from"
            case "yearDeceased":
                return "yearDeceased.from"
            default:
                return field;
        }
    }

    function translateSortFieldRev(field: string | undefined){
        if(field == undefined){
            return undefined;
        }

        switch(field){
            case "archive.name":
                return "archive"
            case "originator.name":
                return "originator"
            case "yearBorn.from":
                return "yearBorn"
            case "yearMarried.from":
                return "yearMarried"
            case "yearDeceased.from":
                return "yearDeceased"
            default:
                return field;
        }
    }

    const onSort = (event: DataTableSortEvent) => {
        archivalRecordActions.setOrder(translateSortField(event.sortField), event.sortOrder)
    };

    return (
        <div className={styles.tableWrapper}>
            <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedRecord(null)} />
            
            <DataTable
                onContextMenu={(e) => cm?.current.show(e.originalEvent)} 
                contextMenuSelection={selectedRecord} 
                onContextMenuSelectionChange={(e) => setSelectedRecord(e.value)}
                value={archivalRecordSelector.data}
                tableStyle={{ minWidth: '50rem' }}
                sortField={translateSortFieldRev(archivalRecordSelector.sortField)}
                sortOrder={archivalRecordSelector.sortOrder}
                removableSort
                //scrollable 
                //scrollHeight="700px" 
                
                onSort={onSort}
                emptyMessage="Žádné výsledky nebyly nalezeny"
                size="small"
                onRowClick={onRowSelect}
                
                rowClassName={getRowClassName}
            >
                <Column field="inventoryNumber" header="Inv.č." sortable/>
                <Column field="signature" header="Sig." sortable/>
                <Column
                    field="originator"
                    header={<><p>Původce</p><p><small>Typ původce</small></p></>}
                    body={(rowData: any) => (
                        <div>
                            <p>{rowData.originator?.name}</p>
                            <p><small>{rowData.originator?.type}</small></p>
                        </div>
                    )}
                    sortable
                />

                <Column
                    field="yearBorn"
                    header={<><p>Narození od-do</p><p><small>Index narození</small></p></>}
                    body={(rowData: any) => (
                        <div>
                            <p>{formatTimeRange(rowData.yearBorn)}</p>
                            <p><small>{formatTimeRange(rowData.yearBornIndex)}</small></p>
                        </div>
                    )}
                    sortable
                />
                <Column
                    field="yearMarried"
                    header={<><p>Oddaní od-do</p><p><small>Index oddání</small></p></>}
                    body={(rowData: any) => (
                        <div>
                            <p>{formatTimeRange(rowData.yearMarried)}</p>
                            <p><small>{formatTimeRange(rowData.yearMarriedIndex)}</small></p>
                        </div>
                    )}
                    sortable
                />
                <Column
                    field="yearDeceased"
                    header={<><p>Zemřelí od-do</p><p><small>Index zemřelí</small></p></>}
                    body={(rowData: any) => (
                        <div>
                            <p>{formatTimeRange(rowData.yearDeceased)}</p>
                            <p><small>{formatTimeRange(rowData.yearDeceasedIndex)}</small></p>
                        </div>
                    )}
                    sortable
                />
                <Column
                    field="locations"
                    header="Obce"
                    body={(rowData: any) => (
                        <LocationBadge locations={rowData.locations} />
                    )}
                />
                <Column field="numberOfScans" header="Počet snímků"

                    body={(rowData: any) => (
                        <div style={{ textAlign: 'center' }}>{rowData.numberOfScans}</div>
                    )}
                />
                <Column field="archive" header="Archiv" sortable/>
            </DataTable>
        </div>
    )

}

export default Table;