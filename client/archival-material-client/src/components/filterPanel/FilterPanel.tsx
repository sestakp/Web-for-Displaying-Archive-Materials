import { AutoComplete, AutoCompleteChangeEvent } from "primereact/autocomplete";
import { Dropdown } from "primereact/dropdown";
import { Col, Row } from "react-bootstrap";
import useArchivalRecordActions from "../../store/archivalRecord/hooks/archivalRecordActionHook";
import useArchivalRecordSelector from "../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import useLocationSelector from "../../store/location/hooks/useLocationSelectorHook";
import { useEffect, useState } from "react";
import isObject from "../../utils/isObject";
import useLocationActions from "../../store/location/hooks/useLocationActionHook";
import VillageDropdownOption from "../villageDropdownOption/villageDropdownOption";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import useArchiveSelector from "../../store/archive/hooks/archiveSelectorHook";
import useArchiveActions from "../../store/archive/hooks/archiveActionHook";
import logger from "../../utils/loggerUtil";
import VillagePreviewTemplate from "../villagePreviewTemplate/VillagePreviewTemplate";
import { Button } from "primereact/button";
import LoadingStatusEnum from "../../models/LoadingStatusEnum";
import styles from "./FilterPanel.module.scss"


const FilterPanel : React.FC = () => {
    
    
    
    const { setArchive, setCountry, setRegion, setDistrict, setOnlyDigitalized, setLocation, setYearFrom, setYearTo, setPage, resetFilters } = useArchivalRecordActions();
    const { archive, country, region, district, onlyDigitalized, yearFrom, yearTo, location } = useArchivalRecordSelector();
    
    const archiveActions = useArchiveActions()
    
    const [yearFromValue, setYearFromValue] = useState<number|undefined>(yearFrom);
    const [yearToValue, setYearToValue] = useState<number|undefined>(yearTo);
    const [villageFilter, setVillageFilter] = useState(location ?? undefined)

    
    const archiveSelector = useArchiveSelector()

    const locationSelector = useLocationSelector();
    const locationAction = useLocationActions();

    const handleVillageInputChange = (event: AutoCompleteChangeEvent) => {
      if(event.value == null){
        return;
      }

        console.log("handleVillageInputChange: ", event.value)
        console.log("handleVillageInputChange: ", location)
        setVillageFilter(event.value)
  
        if(isObject(event.target.value)){
          
          setLocation(event.target.value);
        }
        else{
          setLocation(undefined);
        }
        
    };

    useEffect(() =>{
        setVillageFilter(location ?? undefined)
    }, [region, district])

    
    useEffect(() =>{
      if(location == undefined){
        setVillageFilter(undefined)
      }
    }, [location])

    
    useEffect(() =>{
      setYearFromValue(yearFrom)
  }, [yearFrom])

    useEffect(() =>{
      setYearToValue(yearTo)
  }, [yearTo])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          if(yearFrom != yearFromValue){
            setYearFrom(yearFromValue);
            setPage(1);
          }
        }, 300);
        return () => clearTimeout(timeoutId);
      }, [yearFromValue]);
  
      useEffect(() => {
        const timeoutId = setTimeout(() => {
          if(yearTo != yearToValue){
            setYearTo(yearToValue);
            setPage(1);
          }
        }, 300);
        return () => clearTimeout(timeoutId);
      }, [yearToValue]);


    useEffect(() => {
        archiveActions.fetchArchives()
        locationAction.fetchCountries()
    }, [])


    return (
        <div style={{display: "flex", marginTop: "20px"}}>
          <Row>
          <Col md={6} lg={4} xxl={3}>
          <div style={{padding: "10px 0 30px 0"}}>
            <span className="p-float-label">

                  <Dropdown 
                    className="w-full" 
                    id="country"
                    value={country} 
                    onChange={(e) => setCountry(e.value ?? undefined)} 
                    options={locationSelector.countries}
                    placeholder="Filtrovat podle státu" 
                    filter
                    showClear
                  />
                  
                  <label htmlFor="country">Státy</label>
              </span>
          </div>
          </Col>
          <Col md={6} lg={4} xxl={3}>
          <div style={{padding: "10px 0 30px 0"}}>
            <span className="p-float-label">

                  <Dropdown 
                    className="w-full" 
                    id="region"
                    value={region} 
                    onFocus={locationAction.fetchRegions}
                    onChange={(e) => setRegion(e.value ?? undefined)} 
                    options={locationSelector.regions}
                    optionGroupLabel="name" 
                    optionGroupChildren="regions"
                    optionGroupTemplate={(option) => {console.log("option: ", option); return option.name}}
                    placeholder="Filtrovat podle kraje" 
                    filter 
                    showClear
                  />
                  
                  <label htmlFor="region">Kraj</label>
              </span>
          </div>
          </Col>
          <Col md={6} lg={4} xxl={3}>
          <div style={{padding: "10px 0 30px 0"}}>
            <span className="p-float-label">

                  <Dropdown 
                    className="w-full" 
                    id="district"
                    value={district} 
                    onFocus={locationAction.fetchDistricts}
                    onChange={(e) => setDistrict(e.value ?? undefined)} 
                    options={locationSelector.districts}
                    optionGroupLabel="name" 
                    optionGroupChildren="districts"
                    placeholder="Filtrovat podle okresu" 
                    filter 
                    showClear
                  />
                  
                  <label htmlFor="district">Okres</label>
              </span>
          </div>
          </Col>
          <Col md={6} lg={4} xxl={3}>
          <div style={{padding: "10px 0 30px 0"}}>
            <span className="p-float-label">
                  <AutoComplete  
                    id="village"
                    value={villageFilter} 
                    suggestions={locationSelector.locations}
                    completeMethod={(e) => locationAction.fetchLocations(e.query)} 
                    //field="municipality"
                    itemTemplate={VillageDropdownOption}
                    selectedItemTemplate={VillagePreviewTemplate}
                    onChange={handleVillageInputChange} 
                    inputClassName="w-full"
                    className="w-full"
                    forceSelection
                    
                  />
                  
                  <label htmlFor="village">Obec</label>
              </span>
          </div>
          </Col>
          <Col md={6} lg={4} xxl={3}>
          <div style={{padding: "10px 0 30px 0"}}>
            <span className="p-float-label">

                  <div className="flex align-items-center">
                    <Checkbox inputId="digitalized" name="pizza" value="Cheese" onChange={(e) => setOnlyDigitalized(e.checked ?? false)} checked={onlyDigitalized} />
                    <label htmlFor="digitalized" className="ml-4">Zobrazit pouze digitalizované</label>
                </div>
              </span>
          </div>
          </Col>
          <Col md={6} lg={4} xxl={3}>
            <div style={{padding: "10px 0 30px 0"}}>
              <span className="p-float-label">
                  <InputNumber className="w-full" id="year-from" value={yearFromValue} onChange={(e) => setYearFromValue(e.value ?? undefined)} format={false}/>
                  <label htmlFor="year-from">Od roku</label>
              </span>
            </div>  
          </Col>
          <Col md={6} lg={4} xxl={3}>
            <div style={{padding: "10px 0 30px 0"}}>
              <span className="p-float-label" >
                  <InputNumber className="w-full" id="year-to" value={yearToValue} onChange={(e) => setYearToValue(e.value ?? undefined)} format={false}/>
                  <label htmlFor="year-to">Do roku</label>
              </span>
            </div>
          </Col>
          <Col md={6} lg={4} xxl={3}>
            <div style={{padding: "10px 0 30px 0"}}>
              <span className="p-float-label">
                  <Dropdown className="w-full" id="archiveAbbr" value={archive} onChange={(e) => setArchive(e.value ?? undefined)} options={archiveSelector.data} optionLabel="abbreviation" placeholder="Filtrovat podle archivu" filter showClear/>
                  <label htmlFor="archiveAbbr">Archiv</label>
              </span>
            </div>
          </Col>
          <Col md={6} lg={4} xxl={3}>
            <div style={{padding: "10px 0 30px 0"}}>
                  <Button label="Resetovat filtry" className={`${styles.resetFiltersButton} w-full`} onClick={resetFilters}/>
                 
            </div>
          </Col>
        </Row>
        </div>
    )
}

export default FilterPanel;