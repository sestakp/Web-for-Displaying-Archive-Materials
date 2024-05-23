import React from "react";
import styles from "./NotFound.module.scss"
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import pageNotFoundImg from "../../../assets/errors/pageNotFound.png"

import { Container, Row, Col } from "react-bootstrap";
import Paper from "../../../components/Paper/Paper";

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    
    const handleGoBack = () => {
        navigate(-1)
    };
    
    return(
        <Paper className={`${styles.outerContainer}`}>
            <Container>
                <Row>
                    <Col>
                        <img src={pageNotFoundImg} alt="page not found icon" className={styles.errorImage} draggable="false"/>
                    </Col>
                    <Col>
                            <h2 className={styles.oopsText}>OOPS!</h2>
                            <h4>Chyba 404: Stránka nenalezena</h4>
                            <Button label="Vrátit se zpět" onClick={handleGoBack} />
                    </Col>
                </Row>
            </Container>
        </Paper>
    )
}

export default NotFound;