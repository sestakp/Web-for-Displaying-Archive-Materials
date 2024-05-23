import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import styles from "./FullTextSearch.module.scss";
import useArchivalRecordSelector from "../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import useArchivalRecordActions from "../../store/archivalRecord/hooks/archivalRecordActionHook";
import { Button } from 'primereact/button';
import FilterPanel from "../filterPanel/FilterPanel";

        

const FullTextSearch: React.FC = () => {

    const { setSearchText, setPage, toggleFiltersOpen } = useArchivalRecordActions();
    const { textSearch, filtersOpen } = useArchivalRecordSelector();

    const [inputValue, setInputValue] = useState(textSearch);

    //const [showAdditionalSettings, setShowAdditionalSettings] = useState<boolean>(false);

  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };
      
  
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if(inputValue != textSearch){
          setSearchText(inputValue);
          setPage(1);
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }, [inputValue]);
  

    return (
      <>
      <div style={{width: "100%", display: "flex"}}>
        <span className={`p-input-icon-left ${styles.fullTextSearch}`}>
            <i className={`pi pi-search ${styles.icon}`} />
            <InputText placeholder="Zde vložte hledaný výraz" value={inputValue} onChange={handleInputChange} />
        </span>
        <Button className={`${styles.filterButton}`} icon="pi pi-filter" onClick={toggleFiltersOpen} tooltip="Přepnutí zobrazení filtrů"/>
      </div>
      {filtersOpen && 
        <FilterPanel />
      }
      </>
    );

};

export default FullTextSearch;
