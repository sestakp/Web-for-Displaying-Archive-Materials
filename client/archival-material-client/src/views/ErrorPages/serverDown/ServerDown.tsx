import React from "react";
import styles from "./ServerDown.module.scss"
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import serverDownImg from "../../../assets/errors/serverDown.png"

import { Container, Row, Col } from "react-bootstrap";
import Paper from "../../../components/Paper/Paper";
import RoutesEnum from "../../../layout/RoutesEnum";

const ServerDown: React.FC = () => {
    const navigate = useNavigate();
    
    const handleGoHome = () => {
        navigate(RoutesEnum.HOME)
    };
    
    return(
        <Paper className={`${styles.outerContainer}`}>
            <Container>
                <Row>
                    <Col>
                        <img src={serverDownImg} alt="server down icon" className={styles.errorImage} draggable="false"/>
                    </Col>
                    <Col>
                            <h2 className={styles.oopsText}>OOPS!</h2>
                            <h4>Server je momentálně nedostupný</h4>
                            <Button label="Vrátit se zpět" onClick={handleGoHome} />
                    </Col>
                </Row>
            </Container>
        </Paper>
    )
}

export default ServerDown;