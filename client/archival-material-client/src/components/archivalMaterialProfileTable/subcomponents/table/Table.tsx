import React, { useEffect, useState } from "react";
import { DataTable, DataTableRowClassNameOptions, DataTableRowEvent, DataTableRowMouseEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import styles from "./Table.module.scss"
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
import ExpandedRow from "../expandedRow/expandedRow";
import ArchivalMaterialDetailPanel from "../../../archivalMaterialDetailPanel/archivalMaterialDetailPanel";


const Table: React.FC = () => {


    const [expandedRow, setExpandedRow] = useState<any>(undefined);

    const archivalRecordActions = useArchivalRecordActions()
    const archivalRecordSelector = useArchivalRecordSelector()
    const navigate = useNavigate()

    /*When row is expanded, and swtichted from notes to bookmarks, then expanded row must be resetted*/
    useEffect(() => {
        setExpandedRow(undefined);
    }, [archivalRecordSelector.typeOfRecord])


    useEffect(() => {
        if (archivalRecordSelector.typeOfRecord != TypeOfRecordEnum.UNSET) {
            archivalRecordActions.fetchArchivalRecords(undefined)
        }
    }, [archivalRecordSelector.page,
    archivalRecordSelector.pageSize,
    archivalRecordSelector.textSearch,
    archivalRecordSelector.typeOfRecord,
    archivalRecordSelector.yearFrom,
    archivalRecordSelector.yearTo,
    archivalRecordSelector.archive,
    archivalRecordSelector.location,
    archivalRecordSelector.onlyFavourites,
    archivalRecordSelector.onlyWithBookmarks,
    archivalRecordSelector.onlyWithNotes
    ])

    const onRowExpand = (event: DataTableRowEvent) => {
        archivalRecordActions.getArchivalRecordById(event.data.id)
        setExpandedRow(event.data)
    };

    const onRowCollapse = (event : DataTableRowEvent) => {
        setExpandedRow(undefined)
    };

    const { archivalMaterialCategory } = useParams();


    const onRowSelect = (event: DataTableRowMouseEvent) => {
        //logger.debug("Row clicked: ", event.data)
        navigate(`${RoutesEnum.ARCHIVAL_MATERIAL}/${archivalMaterialCategory}/${event.data.id}`)
    };

    const getRowClassName = (rowData: any, options: DataTableRowClassNameOptions<any[]>) => {
        return styles.datatableRow; // Custom class for rows
    };

    if (archivalRecordSelector.status == LoadingStatusEnum.LOADING) {
        return <Loading />
    }

    if(archivalRecordSelector.typeOfRecord != TypeOfRecordEnum.MATRIKA){
        return (
            <div className={styles.tableWrapper}>
                {archivalRecordSelector.data.map(record =>
                    <OtherArchivalMaterialRow key={record.id} record={record} expandedRow={expandedRow} setExpandedRow={setExpandedRow}/>
                )}
            </div>
        )
    }



    return (
        <div className={styles.tableWrapper}>
            <DataTable
                value={archivalRecordSelector.data}
                tableStyle={{ minWidth: '50rem' }}
                //scrollable 
                //scrollHeight="700px" 
                emptyMessage="Žádné výsledky nebyly nalezeny"
                size="small"
                onRowClick={onRowSelect}
                rowClassName={getRowClassName}
                rowExpansionTemplate={(data) => <ArchivalMaterialDetailPanel archivalMaterialId={data.id} />}
                onRowExpand={onRowExpand} 
                onRowCollapse={onRowCollapse}
                expandedRows={[expandedRow]}
                //onRowToggle={(e: DataTableRowToggleEvent) => setExpandedRows(e.data)}
            >
                <Column expander />
                <Column field="inventoryNumber" header="Inv.č." />
                <Column field="signature" header="Sig." />
                <Column
                    field="originator"
                    header={<><p>Původce</p><p><small>Typ původce</small></p></>}
                    body={(rowData: any) => (
                        <div>
                            <p>{rowData.originator?.name}</p>
                            <p><small>{rowData.originator?.type}</small></p>
                        </div>
                    )}
                />

                <Column
                    field="birthIndex"
                    header={<><p>Narození od-do</p><p><small>Index narození</small></p></>}
                    body={(rowData: any) => (
                        <div>
                            <p>{formatTimeRange(rowData.yearBorn)}</p>
                            <p><small>{formatTimeRange(rowData.yearBornIndex)}</small></p>
                        </div>
                    )}
                />
                <Column
                    field="weddingIndex"
                    header={<><p>Oddaní od-do</p><p><small>Index oddání</small></p></>}
                    body={(rowData: any) => (
                        <div>
                            <p>{formatTimeRange(rowData.yearMarried)}</p>
                            <p><small>{formatTimeRange(rowData.yearMarriedIndex)}</small></p>
                        </div>
                    )}
                />
                <Column
                    field="deadIndex"
                    header={<><p>Zemřelí od-do</p><p><small>Index zemřelí</small></p></>}
                    body={(rowData: any) => (
                        <div>
                            <p>{formatTimeRange(rowData.yearDeceased)}</p>
                            <p><small>{formatTimeRange(rowData.yearDeceasedIndex)}</small></p>
                        </div>
                    )}
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
                <Column field="archive" header="Archiv" />
            </DataTable>
        </div>
    )

}

export default Table;