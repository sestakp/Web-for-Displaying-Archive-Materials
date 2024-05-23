import React from "react";

import { Route, Routes as RouterDomRoutes } from 'react-router-dom';
import Home from "../views/home/Home";
import Login from "../views/login/Login";
import NotFound from "../views/ErrorPages/notFound/NotFound";
import Register from "../views/register/Register";
import RoutesEnum from "./RoutesEnum";
import ForgotPassword from "../views/forgotPassword/forgotPassword";
import ArchivalMaterials from "../views/archivalMaterials/ArchivalMaterials";
import ArchivalMaterialDetail from "../views/archivalMaterialDetail/ArchivalMaterialDetail";
import ArchivalScanPreview from "../views/archivalScanPreview/ArchivalScanPreview";
import DefaultLayout from "./DefaultLayout/DefaultLayout";
import Profile from "../views/profile/Profile";
import ChangePassword from "../views/changePassword/ChangePassword";
import Unauthorized from "../views/ErrorPages/unauthorized/Unauthorized";
import ServerDown from "../views/ErrorPages/serverDown/ServerDown";
import ResetPassword from "../views/resetPassword/resetPassword";
import BerneseRoule from "../views/berneseRoule/berneseRoule";
import InventoryOfSubjectsByFaith from "../views/inventoryOfSubjectsByFaith/inventoryOfSubjectsByFaith";
import VillageFilter from "../views/villageFilter/VillageFilter";
import { OpenSeadragonProvider } from "../context/OpenSeadragonContext";
import Credit from "../views/credit/Credit";
import OtherProjects from "../views/otherProjects/otherProjects";

const Routes: React.FC = () => {

    return(
        <RouterDomRoutes>
            <Route 
                path={RoutesEnum.LOGIN} 
                element={
                    <DefaultLayout>
                        <Login />
                    </DefaultLayout>
                } 
            />
            <Route 
                path={RoutesEnum.REGISTER} 
                element={
                    <DefaultLayout>
                        <Register />
                    </DefaultLayout>
                } 
            />
            <Route 
                path={RoutesEnum.HOME} 
                element={
                    <DefaultLayout>
                        <Home />
                    </DefaultLayout>
                }
            />
            <Route 
                path={RoutesEnum.FORGOT_PASSWORD} 
                element={
                    <DefaultLayout>
                        <ForgotPassword />
                    </DefaultLayout>
                } 
            />
            <Route 
                path={RoutesEnum.PROFILE} 
                element={
                    <DefaultLayout>
                        <Profile />
                    </DefaultLayout>
                } 
            />
            <Route 
                path={RoutesEnum.CHANGE_PASSWORD} 
                element={
                    <DefaultLayout>
                        <ChangePassword />
                    </DefaultLayout>
                } 
            />
            
            <Route 
                path={RoutesEnum.RESET_PASSWORD+"/:resetHash"} 
                element={
                    <DefaultLayout>
                        <ResetPassword />
                    </DefaultLayout>
                } 
            />
            <Route 
                path={RoutesEnum.ARCHIVAL_MATERIAL+"/berni-rula"} 
                element={
                    <DefaultLayout>
                        <BerneseRoule />
                    </DefaultLayout>
                } 
            />

            <Route 
                path={RoutesEnum.ARCHIVAL_MATERIAL+"/soupis-poddanych-dle-viry"} 
                element={
                    <DefaultLayout>
                        <InventoryOfSubjectsByFaith />
                    </DefaultLayout>
                } 
            />
            
            <Route 
                path={RoutesEnum.ARCHIVAL_MATERIAL+"/vyhledat"} 
                element={
                    <DefaultLayout>
                        <VillageFilter />
                    </DefaultLayout>
                } 
            />

            <Route 
                path={RoutesEnum.ARCHIVAL_MATERIAL+"/:archivalMaterialCategory"} 
                element={
                    <DefaultLayout>
                        <ArchivalMaterials />
                    </DefaultLayout>
                } 
            />
            <Route 
                path={RoutesEnum.ARCHIVAL_MATERIAL+"/:archivalMaterialCategory/:archivalMaterialId"} 
                element={
                    <DefaultLayout>
                        <ArchivalMaterialDetail />
                    </DefaultLayout>
                } 
            />
            <Route 
                path={RoutesEnum.ARCHIVAL_MATERIAL_PREVIEW+"/:archivalMaterialId/:scanIndex"} 
                element={
                    <OpenSeadragonProvider>
                        <ArchivalScanPreview />
                    </OpenSeadragonProvider>
                } 
            />
            <Route 
                path={RoutesEnum.UNAUTHORIZED} 
                element={
                    <DefaultLayout>
                        <Unauthorized />
                    </DefaultLayout>
                } 
            />
            <Route 
                path={RoutesEnum.SERVER_DOWN} 
                element={
                    <DefaultLayout>
                        <ServerDown />
                    </DefaultLayout>
                } 
            />
            
            <Route 
                path={RoutesEnum.NOT_FOUND} 
                element={
                    <DefaultLayout>
                        <NotFound />
                    </DefaultLayout>
                } 
            />
            <Route 
                path={RoutesEnum.CREDIT} 
                element={
                    <DefaultLayout>
                        <Credit />
                    </DefaultLayout>
                } 
            /> 
            <Route 
                path={RoutesEnum.OTHER_PROJECTS} 
                element={
                    <DefaultLayout>
                        <OtherProjects />
                    </DefaultLayout>
                } 
            />
            <Route 
                path='*' 
                element={
                    <DefaultLayout>
                        <NotFound />
                    </DefaultLayout>
                } 
            />
        </RouterDomRoutes>

    )
}

export default Routes;