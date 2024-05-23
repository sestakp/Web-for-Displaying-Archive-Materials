import React from "react";

import { BrowserRouter } from 'react-router-dom';
import Routes from "./Routes";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { OpenSeadragonProvider } from "../context/OpenSeadragonContext";

const Router: React.FC = () => {

    return (
        <BrowserRouter>
            <Provider store={store}>
                {/*<OpenSeadragonProvider>*/}
                    <Routes />
                {/*</OpenSeadragonProvider>*/}
            </Provider>
        </BrowserRouter>

    )
}

export default Router;