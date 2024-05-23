import React from "react";
import styles from "./Footer.module.scss"
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { Container, Row, Col } from "react-bootstrap";
import generateNumbersAroundIndex from "../../../../utils/generateNumbersAroundIndex";
import Badge from "../../../badge/Badge";
import { InputNumber } from "primereact/inputnumber";
import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import useArchivalRecordActions from "../../../../store/archivalRecord/hooks/archivalRecordActionHook";
import isMobile from "../../../../utils/isMobile";


const Footer: React.FC = () => {

    const archivalRecordActions = useArchivalRecordActions();
    const archivalRecordSelector = useArchivalRecordSelector();

    const pageIndex = archivalRecordSelector.page;
    const minPage = archivalRecordSelector.minPage;
    const maxPage = archivalRecordSelector.maxPage;
    const pageSize = archivalRecordSelector.pageSize;

    const mobile = isMobile()




    const numbers = generateNumbersAroundIndex(pageIndex, minPage, maxPage, 5)


    return(
        <div className={`${styles.footer}`}>
            <Container>
                <Row >
                    <Col className={`${styles.section1}`} md={6} lg={5}>
                        <i 
                            className={`pi pi-angle-double-left ${archivalRecordSelector.isMinPage ? styles.disable : ""}`}

                            onClick={() => {
                                if( ! archivalRecordSelector.isMinPage ){

                                    archivalRecordActions.setPage(minPage)
                                }
                            }}
                        />
                        <i 
                            className={`pi pi-angle-left ${archivalRecordSelector.isMinPage ? styles.disable : ""}`} 
                            onClick={() =>  {    
                                if( ! archivalRecordSelector.isMinPage ){
                                    archivalRecordActions.decrementPage()
                                }                          
                            }}
                        
                        />
                        {numbers.map(n => 
                            <Badge 
                                key={n}
                                value={n} 
                                className={n == pageIndex ? styles.selectedBadge : ""}
                                onClick={() => archivalRecordActions.setPage(n) }
                            />
                        )}
                        <i 
                            className={`pi pi-angle-right ${archivalRecordSelector.isMaxPage ? styles.disable : ""}`} 
                            onClick={() =>                                
                                archivalRecordActions.incrementPage()
                            }
                        />
                        <i 
                            className={`pi pi-angle-double-right ${archivalRecordSelector.isMaxPage ? styles.disable : ""}`} 
                            onClick={() =>                                
                                archivalRecordActions.setPage(maxPage)
                            }
                        />
                        { ! mobile && 
                            <>
                                <InputNumber 
                                    className={`${styles.inputNumber}`} 
                                    inputStyle={{ width: "100%" }} 
                                    min={minPage} 
                                    max={maxPage} 
                                    value={pageIndex} 
                                    useGrouping={false}
                                    onChange={e => archivalRecordActions.setPage(e.value)}
                                />
                                <span>
                                    z {maxPage} stránek
                                </span>
                            </>
                        }
                        
                    </Col>
                    {! mobile && 
                        <Col className={`${styles.section2}`} md={0} lg={2}>
                            <Button label="načíst další" disabled={ ! archivalRecordSelector.canLoadNext} className={styles.loadNextButton} onClick={archivalRecordActions.loadNext}/>
                        </Col>
                    }
                    
                    <Col className={`${styles.section3}`} md={6} lg={5}>
                        <span>Počet záznamů na stránce: </span>
                        <div>
                            <Dropdown value={pageSize} onChange={(e) => archivalRecordActions.setPageSize(e.value)} options={[10, 25, 50, 100]} />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;