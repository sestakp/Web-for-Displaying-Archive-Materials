import React from "react";
import { Button } from "primereact/button";
import { Divider } from 'primereact/divider';
import styles from './Navbar.module.scss';
import { Link, useNavigate } from "react-router-dom";
import RoutesEnum from "../RoutesEnum";
import { Col, Container, Row } from "react-bootstrap";
import useUserSelector from "../../store/user/hooks/userSelectorHook";
import useUserActions from "../../store/user/hooks/userActionHook";

const Navbar: React.FC = () => {

    const navigate = useNavigate()
    const userSelector = useUserSelector()
    const userActions = useUserActions()
    const currentUser = userSelector.user

    return(
        <nav className={styles.nav}>
            <Container>
                <Row>
                    <Col xl={8} md={6} className={`p-1`}>
                        <Link to={RoutesEnum.HOME}><h1 className={`${styles.header}`}>PortaArchiva</h1></Link>
                    </Col>
                    
                    {currentUser == undefined &&
                        <Col xl={4} md={6} className={`${styles.center}`} >
                            <div className={styles.buttonWrapper}>
                                <Link to={RoutesEnum.LOGIN} className={`p-1`}>
                                    <Button label="Přihlásit" className={styles.button} icon="pi pi-sign-in" />
                                </Link>
                                <Divider layout="vertical" className={styles.divider}/>
                                <Link to={RoutesEnum.REGISTER} className={`p-1`}>
                                    <Button label="Registrovat" className={styles.button} icon="pi pi-sign-in"/>
                                </Link>
                            </div>
                        </Col>
                    }
                    {currentUser != undefined &&
                        <Col xl={4} md={6} className={`${styles.center}`} >
                            <Button label={currentUser.name} className={styles.button} icon="pi pi-user" onClick={() => navigate(RoutesEnum.PROFILE)} />
                            <Button label="Odhlásit" className={styles.button} icon="pi pi-sign-out" onClick={() => userActions.logout()} />
                        </Col>
                    }
                    
                </Row>
            </Container>

        </nav>
    )
}

export default Navbar;