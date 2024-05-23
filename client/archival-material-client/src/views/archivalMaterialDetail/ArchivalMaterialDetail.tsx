import React, { useEffect } from "react";
import styles from "./ArchivalMaterialDetail.module.scss"
import { BreadCrumb } from "primereact/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import categories from "../../configs/categories";
import Paper from "../../components/Paper/Paper";
import { MenuItem } from "primereact/menuitem";
import { Col, Row } from "react-bootstrap";
import RoutesEnum from "../../layout/RoutesEnum";
import useArchivalRecordActions from "../../store/archivalRecord/hooks/archivalRecordActionHook";
import useArchivalRecordSelector from "../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import Loading from "../../components/loading/Loading";
import formatName from "../../utils/formatters/formatName";
import useUserSelector from "../../store/user/hooks/userSelectorHook";
import ArchivalMaterialDetailPanel from "../../components/archivalMaterialDetailPanel/archivalMaterialDetailPanel";


const ArchivalMaterialDetail: React.FC = () => {

    const archivalRecordActions = useArchivalRecordActions()
    const archivalRecordSelector = useArchivalRecordSelector()

    const userSelector = useUserSelector()

    const navigate = useNavigate()
    const { archivalMaterialId } = useParams();
    
    const category = categories.find(c => c.type == archivalRecordSelector.detail?.typeOfRecord);

    const items: MenuItem[] = [
        { 
            icon: category?.icon,
            label: category?.name, 
            command: () => navigate(`${RoutesEnum.ARCHIVAL_MATERIAL}/${category?.linkName}`) 
        }, 
        {
            label: formatName(archivalRecordSelector?.detail) 
        }
    ];
    const home: MenuItem = { icon: 'pi pi-home', command: () => navigate(`/`) }


    useEffect(() => {
        archivalRecordActions.getArchivalRecordById(Number(archivalMaterialId))
    },[])


    if(archivalRecordSelector.detail == undefined){
        return <Loading />
    }
    
    return(
        <Paper >
            <div style={{height: "100%"}}>
                <Row>
                    <Col sm={11}>
                        <BreadCrumb model={items} home={home} className={styles.breadcrumb}/>
                    </Col>
                    <Col sm={1} className={`${styles.heart}`}>
                        {userSelector.user?.id != undefined && ! archivalRecordSelector.detail.isFavourite &&
                            <i className="pi pi-heart" onClick={() => archivalRecordActions.addToFavourites(archivalRecordSelector.detail?.id)}/>
                        }
                        {userSelector.user?.id != undefined && archivalRecordSelector.detail.isFavourite &&
                            <i className="pi pi-heart-fill" onClick={() => archivalRecordActions.removeFromFavourites(archivalRecordSelector.detail?.id)}/>
                        }
                    </Col>
                </Row>

                <ArchivalMaterialDetailPanel archivalMaterialId={Number(archivalMaterialId)}/>
            </div>
        </Paper>
    )
}

export default ArchivalMaterialDetail;