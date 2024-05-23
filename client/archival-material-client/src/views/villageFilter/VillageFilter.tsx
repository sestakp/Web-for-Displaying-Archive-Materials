




import { useEffect, useMemo, useState } from "react";
import ArchivalCategory from "../../models/ArchivalCategory";
import categories from "../../configs/categories";
import { useNavigate } from "react-router-dom";
import Paper from "../../components/Paper/Paper";
import { BreadCrumb } from "primereact/breadcrumb";
import styles from "./VillageFilter.module.scss"
import FilterPanel from "../../components/filterPanel/FilterPanel";
import { Accordion, AccordionTab } from "primereact/accordion";
import ArchivalMaterialTable from "../../components/archivalMaterialTable/ArchivalMaterialTable";
import TypeOfRecordEnum from "../../models/TypeOfRecordEnum";
import logger from "../../utils/loggerUtil";
import useArchivalRecordActions from "../../store/archivalRecord/hooks/archivalRecordActionHook";
import useArchivalRecordSelector from "../../store/archivalRecord/hooks/archivalRecordSelectorHook";

const VillageFilter : React.FC = () => {
    
    const navigate = useNavigate()

    const { setPage, getCountsByMunicipality } = useArchivalRecordActions();
    const { location, region, district, counts } = useArchivalRecordSelector();

    const category: ArchivalCategory = useMemo(() => categories.find((c) => c.linkName === "vyhledat") || {} as ArchivalCategory, []);

    const items = useMemo(() => [{ icon: category?.icon, label: category?.name }], [category]);
  
    const home = useMemo(() => ({ icon: 'pi pi-home', command: () => navigate(`/`) }), [navigate]);

    const [activeIndex, setActiveIndex] = useState<number|null>(null);

    useEffect(() => {
        logger.debug("location changed")
        getCountsByMunicipality()
    },[location, region, district])


    logger.debug("counts: ", counts)
    return(
        <Paper>
            <>
                <BreadCrumb model={items} home={home} className={styles.breadcrumb}/>
                <FilterPanel />

                <Accordion activeIndex={activeIndex} onTabChange={(e:any) => { setPage(0); setActiveIndex(e.index) } } style={{paddingTop: "10px"}}>
                    {counts.lanoveRejstriky > 0 &&
                        <AccordionTab header={`Lánové rejstříky (${counts.lanoveRejstriky})`} >
                            {activeIndex === 0 &&
                                <ArchivalMaterialTable typeOfRecord={TypeOfRecordEnum.LANOVY_REJSTRIK}/>
                            }
                        </AccordionTab>
                    }
                    
                    {counts.matriky > 0 &&
                        <AccordionTab header={`Matriky (${counts.matriky})`} >
                            {activeIndex === 1 &&
                                <ArchivalMaterialTable typeOfRecord={TypeOfRecordEnum.MATRIKA}/>
                            }
                        </AccordionTab>
                    }

                    {counts.retrifikacniAkta > 0 &&
                        <AccordionTab header={`Rektifikační akta (${counts.retrifikacniAkta})`} >
                            {activeIndex === 2 &&
                                <ArchivalMaterialTable typeOfRecord={TypeOfRecordEnum.REKTIFIKACNI_AKTA}/>
                            }
                        </AccordionTab>
                    }

                    {counts.pozemkoveKnihy > 0 &&
                        <AccordionTab header={`Pozemkové knihy (${counts.pozemkoveKnihy})`} >
                            {activeIndex === 3 &&
                                <ArchivalMaterialTable typeOfRecord={TypeOfRecordEnum.POZEMKOVA_KNIHA}/>
                            }
                        </AccordionTab>
                    }

                    {counts.scitaciOperatory > 0 &&
                        <AccordionTab header={`Sčítací operáty (${counts.scitaciOperatory})`} >
                            {activeIndex === 4 &&
                                <ArchivalMaterialTable typeOfRecord={TypeOfRecordEnum.SCITACI_OPERATOR}/>
                            }
                        </AccordionTab>
                    }

                    {counts.urbare > 0 &&
                        <AccordionTab header={`Urbáře (${counts.urbare})`} >
                            {activeIndex === 5 &&
                                <ArchivalMaterialTable typeOfRecord={TypeOfRecordEnum.URBAR}/>
                            }
                        </AccordionTab>
                    }

                </Accordion>
            </>
        </Paper>
    )
}

export default VillageFilter;