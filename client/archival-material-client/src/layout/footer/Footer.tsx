import React from "react";

import styles from './Footer.module.scss';
import { Container, Row, Col } from "react-bootstrap";
import muniLogo from "../../assets/logos/muni_arts_logo.png"
import vutFitLogo from "../../assets/logos/vut_fit_logo.png"
import tacrLogo from "../../assets/logos/tacr_logo.png"
import openLinkInNewTab from "../../utils/openLinkInNewTab";
import { Link } from "react-router-dom";
import RoutesEnum from "../RoutesEnum";

const Footer: React.FC = () => {



    return(
        <footer className={`${styles.footer}`}>
            
            <Container className={`${styles.container}`}>
                <Row>
                    <Col xxl={8} lg={6} md={4}>
                        <p>Ukázková aplikace, která neslouží jako náhrada aplikací, které poskytují archivy.</p>
                        <p><Link to={RoutesEnum.CREDIT}><span>Použité zdroje</span></Link> | <Link to={RoutesEnum.OTHER_PROJECTS}><span>Ostatní projekty</span></Link></p>
                        
                    </Col>
                    <Col xxl={4} lg={6} md={8} className={`${styles.logoBanner}`}>
                        <Row >
                            <Col md={3} className={`${styles.center} p-1`}>
                                {/*<img src={tacrLogo} alt="TACR Logo" draggable="false" onClick={() => openLinkInNewTab("https://www.tacr.cz/")}/>*/}
                            </Col>
                            
                            <Col md={5} className={`${styles.center} p-1`}>
                                <img src={vutFitLogo} alt="VUT FIT Logo" draggable="false" onClick={() => openLinkInNewTab("https://www.fit.vut.cz")}/>
                            </Col>
                            
                            <Col md={3} className={`${styles.center} p-1`}>
                                <img src={muniLogo} alt="MUNI ARTS Logo" draggable="false" onClick={() => openLinkInNewTab("https://www.phil.muni.cz/")}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;