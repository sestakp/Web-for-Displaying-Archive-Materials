import React, { useEffect } from "react";
import styles from "./Unauthorized.module.scss"
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import lockImg from "../../../assets/errors/lock.png"

import { Container, Row, Col } from "react-bootstrap";
import Paper from "../../../components/Paper/Paper";
import RoutesEnum from "../../../layout/RoutesEnum";
import useUserActions from "../../../store/user/hooks/userActionHook";

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();
    
    const userActions = useUserActions()

    useEffect(() => {
        userActions.logout()
    },[])

    const handleGoHome = () => {
        navigate(RoutesEnum.HOME)
    };
    
    return(
        <Paper className={`${styles.outerContainer}`}>
            <Container>
                <Row>
                    <Col>
                        <img src={lockImg} alt="Lock icon" className={styles.errorImage} draggable="false"/>
                    </Col>
                    <Col>
                            <h2 className={styles.oopsText}>OOPS!</h2>
                            <h4>Chyba 401: Přístup odepřen</h4>
                            <p>Mohlo dojít k restartu serveru a přegenerování klíčů nebo k vypršení platnosti přihlašení, zkuste se prosím přihlásit znovu.</p>
                            <Button label="Vrátit se na domovskou stránku" onClick={handleGoHome} />
                    </Col>
                </Row>
            </Container>
        </Paper>
    )
}

export default Unauthorized;