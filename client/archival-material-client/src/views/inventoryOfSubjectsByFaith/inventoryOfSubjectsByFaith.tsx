import { useMemo } from "react";
import ArchivalCategory from "../../models/ArchivalCategory";
import categories from "../../configs/categories";
import { useNavigate } from "react-router-dom";
import Paper from "../../components/Paper/Paper";
import { BreadCrumb } from "primereact/breadcrumb";
import styles from "./inventoryOfSubjectsByFaith.module.scss"



const InventoryOfSubjectsByFaith : React.FC = () =>{

    const navigate = useNavigate()

    const category: ArchivalCategory = useMemo(() => categories.find((c) => c.linkName === "soupis-poddanych-dle-viry") || {} as ArchivalCategory, []);

    const items = useMemo(() => [{ icon: category?.icon, label: category?.name }], [category]);
  
    const home = useMemo(() => ({ icon: 'pi pi-home', command: () => navigate(`/`) }), [navigate]);

    return(
        <Paper>
            <>
                <BreadCrumb model={items} home={home} className={styles.breadcrumb}/>
                
                <p>
                    Soupis poddaných dle víry vznikl na popud patentu vydaného roku 1650, který nařizoval vrchnosti pořídit soupis poddaných na základě 
                    příslušnosti ke katolické církvi. Na vypracování těchto seznamů měla vrchnost šest týdnů. Každý soupis začínal majitelem panství 
                    případně jeho správcem a následoval seznamem poddaných seřazených podle obcí. V seznamu nemuselo být uvedeno duchovenstvo a vojáci. 
                    Předdefinovaná struktura obsahovala jméno, stav, povolání, věk a údaj o náboženském vyznání. Základní jednotkou soupisu byla rodina, 
                    u jejichž členů se zapisoval vztah vůči hospodáři. Na konec soupisu se připojovaly informace o stavu kostelů a farních budov. 
                    Toto nařízení trvalo jen velmi krátkou dobu, kde po změně stačilo vytvořit soupis pouze nekatolíků. Z tohoto důvodu seznam pro 
                    Čechy není kompletní a pro Moravu a Slezsko není vypracován vůbec.
                </p>
                
                <p>Materiály doposud vyšly pouze knižně a jsou k dispozici po přihlášení  
                    &nbsp;<a href="https://ndk.cz/periodical/uuid:a1f09b40-de57-11e6-b333-5ef3fc9ae867" target="_blank" rel="noreferrer" style={{color: "blue", textDecoration: "underline"}}>ZDE</a> na stránkách národní digitální knihovny. 
                </p>
            </>
        </Paper>
    )
}

export default InventoryOfSubjectsByFaith;