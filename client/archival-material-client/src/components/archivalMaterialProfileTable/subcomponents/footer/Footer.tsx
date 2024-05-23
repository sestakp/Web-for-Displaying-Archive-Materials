import React, { useState } from "react";
import styles from "./Footer.module.scss"
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { Container, Row, Col } from "react-bootstrap";
import generateNumbersAroundIndex from "../../../../utils/generateNumbersAroundIndex";
import Badge from "../../../badge/Badge";
import { InputNumber } from "primereact/inputnumber";
import useArchivalRecordSelector from "../../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import useArchivalRecordActions from "../../../../store/archivalRecord/hooks/archivalRecordActionHook";


const Footer: React.FC = () => {

    const archivalRecordActions = useArchivalRecordActions();
    const archivalRecordSelector = useArchivalRecordSelector();

    const pageIndex = archivalRecordSelector.page;
    const minPage = archivalRecordSelector.minPage;
    const maxPage = archivalRecordSelector.maxPage;
    const pageSize = archivalRecordSelector.pageSize;



    const numbers = generateNumbersAroundIndex(pageIndex, minPage, maxPage, 5)


    return(
        <div className={`${styles.footer}`}>
            <Container>
                <Row >
                    <Col className={`${styles.section1}`} sm={5}>
                        <i 
                            className="pi pi-angle-double-left" 
                            onClick={() =>                                
                                archivalRecordActions.setPage(minPage)
                            }
                        />
                        <i 
                            className="pi pi-angle-left" 
                            onClick={() =>                                
                                archivalRecordActions.decrementPage()
                            }
                        
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
                            className="pi pi-angle-right" 
                            onClick={() =>                                
                                archivalRecordActions.incrementPage()
                            }
                        />
                        <i 
                            className="pi pi-angle-double-right" 
                            onClick={() =>                                
                                archivalRecordActions.setPage(maxPage)
                            }
                        />

                        <InputNumber 
                            className={`${styles.inputNumber}`} 
                            inputStyle={{ width: "100%" }} 
                            min={minPage} 
                            max={maxPage} 
                            value={pageIndex} 
                            useGrouping={false}
                            onChange={(e) => archivalRecordActions.setPage(e.value)}
                        />
                        <span>
                            z {maxPage} stránek
                        </span>
                    </Col>
                    <Col className={`${styles.section2}`} sm={2}>
                    </Col>
                    <Col className={`${styles.section3}`} sm={5}>
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