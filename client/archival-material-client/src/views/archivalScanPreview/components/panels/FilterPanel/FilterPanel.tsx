import AddBookmark from "../../AddBookmark/AddBookmark";
import Filters from "../../Filters/Filters";
import { ScrollPanel } from 'primereact/scrollpanel';
         







const FilterPanel: React.FC = () => {

    return(
        <ScrollPanel style={{height: '90vh', width: "100%"}}>
            <AddBookmark />
            <Filters />  
        </ScrollPanel>
    )

}

export default FilterPanel;