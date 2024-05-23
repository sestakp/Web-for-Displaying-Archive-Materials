import { useEffect, useState } from "react";
import useUserSelector from "../../store/user/hooks/userSelectorHook";
import { useNavigate } from "react-router-dom";
import RoutesEnum from "../../layout/RoutesEnum";
import { Button } from "primereact/button";
import Paper from "../../components/Paper/Paper";
import styles from "./Profile.module.scss"
import EditableProfileField from "../../components/editableProfileField/EditableProfileField";
import { TabPanel, TabView, TabViewTabChangeEvent } from "primereact/tabview";
import FullTextSearch from "../../components/fullTextSearch/FullTextSearch";
import useArchivalRecordActions from "../../store/archivalRecord/hooks/archivalRecordActionHook";
import logger from "../../utils/loggerUtil";
import TypeOfRecordEnum from "../../models/TypeOfRecordEnum";
import ArchivalMaterialProfileTable from "../../components/archivalMaterialProfileTable/archivalMaterialProfileTable";


const Profile: React.FC = () => {

    const userSelector = useUserSelector()
    const archivalRecordActions = useArchivalRecordActions();

    const [activeTab, setActiveTab] = useState<number>(0);

    const navigate = useNavigate()

    useEffect(() => {

        if(userSelector.user === undefined){
            navigate(RoutesEnum.HOME)
        }

    },[userSelector.user, navigate])

    useEffect(() => {
        archivalRecordActions.setOnlyFavourites(true);
        archivalRecordActions.setTypeOfRecord(TypeOfRecordEnum.MATRIKA);
    }, [])


    function onTabChange(event: TabViewTabChangeEvent){
        switch(event.index){
            case 0:
                archivalRecordActions.setOnlyWithNotes(false);
                archivalRecordActions.setOnlyWithBookmarks(false);
                archivalRecordActions.setTypeOfRecord(TypeOfRecordEnum.MATRIKA);
                break;

            case 1:
                archivalRecordActions.setOnlyWithNotes(false);
                archivalRecordActions.setOnlyWithBookmarks(false);
                archivalRecordActions.setTypeOfRecord(TypeOfRecordEnum.VSE_BEZ_MATRIK);
                break;

            case 2: 
                archivalRecordActions.setOnlyWithNotes(true);
                archivalRecordActions.setOnlyWithBookmarks(false);
                archivalRecordActions.setTypeOfRecord(undefined);
                break;

            case 3: 
                archivalRecordActions.setOnlyWithNotes(false);
                archivalRecordActions.setOnlyWithBookmarks(true);
                archivalRecordActions.setTypeOfRecord(undefined);
                break;

            default:
                logger.error("User profile wrong tab panel param")
        }

        setActiveTab(event.index)
    }


    return (
        <Paper>
            <>
            <h1 className={`${styles.profileHeader}`}>Profil</h1>
            <div className={`${styles.topContainer}`}>
                <div className={`${styles.fieldsContainer}`}>
                    
                    <EditableProfileField label="Jméno" value={userSelector.user?.name ?? ""} id="name"/>
                    <EditableProfileField label="Email" value={userSelector.user?.email ?? ""} id="email" />
                
                </div>
                

                <Button label="Změnit heslo" icon="pi pi-lock" onClick={() => navigate(RoutesEnum.CHANGE_PASSWORD)}/>  
            </div>
            <FullTextSearch />
            <TabView activeIndex={activeTab} onTabChange={onTabChange}>
                
                <TabPanel header="Oblíbené matriky">
                    {activeTab === 0 && 
                        <ArchivalMaterialProfileTable />
                    }
                </TabPanel>
                
                <TabPanel header="Oblíbený ostatní archivní materiál">
                    {activeTab === 1 &&
                        <ArchivalMaterialProfileTable />
                    }
                </TabPanel>
                
                <TabPanel header="Poznámky">
                    {activeTab === 2 &&
                        <ArchivalMaterialProfileTable />
                    }
                </TabPanel>
                
                <TabPanel header="Záložky">
                    {activeTab === 3 &&
                        <ArchivalMaterialProfileTable />
                    }
                </TabPanel>

            </TabView>
            </>
        </Paper>
    )
}

export default Profile;