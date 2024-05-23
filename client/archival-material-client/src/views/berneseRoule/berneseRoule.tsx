import { useMemo } from "react";
import ArchivalCategory from "../../models/ArchivalCategory";
import categories from "../../configs/categories";
import { useNavigate } from "react-router-dom";
import Paper from "../../components/Paper/Paper";
import { BreadCrumb } from "primereact/breadcrumb";
import styles from "./berneseRoule.module.scss"


const BerneseRoule : React.FC = () => {
    
    const navigate = useNavigate()

    const category: ArchivalCategory = useMemo(() => categories.find((c) => c.linkName === "berni-rula") || {} as ArchivalCategory, []);

    const items = useMemo(() => [{ icon: category?.icon, label: category?.name }], [category]);
  
    const home = useMemo(() => ({ icon: 'pi pi-home', command: () => navigate(`/`) }), [navigate]);

    return(
        <Paper>
            <>
                <BreadCrumb model={items} home={home} className={styles.breadcrumb}/>
                <p>
                    Jedná se o nejstarší katastr na historickém území Čech. Název je odvozen od staročeského slova berně, které znamená daň. 
                    Jedná se o soupis hospodářů na poddanských usedlostech, jejich pozemkové držby a seznam chovaných hospodářských zvířat. 
                    Berní rula vznikla v polovině 17. století a měla za cíl co nejdetailněji zmapovat skutečný 
                    stav půdy a vyměřit daňové povinnosti pro jednotlivé usedlosti. Výsledky se využívaly k odhadu výši výběru do státní pokladny. 
                    Berní rula je rozdělena po panstvích, kde ke každému panství je uveden soupis poddaných obcí. Jako jednotka se používal 
                    jeden „osedlý“, což byla osoba trvale žijící na daném území. Jednotliví hospodáři jsou seřazeni podle velikosti pozemků. 
                    U každého pole se evidovalo kromě celkové výměry i údaj o tom, jaká část pole byla skutečně oseta.
                </p>

                <p>Materiály doposud vyšly pouze knižně a jsou k dispozici po přihlášení  
                    &nbsp;<a href="https://www.digitalniknihovna.cz/mzk/periodical/uuid:ed965480-9fd9-11e5-a7d7-005056827e52" target="_blank" rel="noreferrer" style={{color: "blue", textDecoration: "underline"}}>ZDE</a> na stránkách národní digitální knihovny. 
                </p>
            </>
        </Paper>
    )
}

export default BerneseRoule;