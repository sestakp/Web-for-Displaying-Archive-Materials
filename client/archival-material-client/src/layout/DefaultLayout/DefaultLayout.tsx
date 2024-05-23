import React, { ReactNode } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import styles from "./DefaultLayout.module.scss"

interface DefaultLayoutProps {
    children: ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {

    return(
        <>
            <Navbar />
            <main className={styles.main}>
                {children}
            </main>
            <Footer />
        </>

    )
}

export default DefaultLayout;