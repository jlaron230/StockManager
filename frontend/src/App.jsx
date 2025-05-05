import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

//Import des pages sur l'application avec leur url
import Home from "./pages/Home";
import UserProfil from "@pages/UserProfil";
import Subscribe from "@pages/Subscribe";
import StoreManage from "@pages/StoreManage";
import StockManage from "@pages/StockManage";
import ProviderManage from "@pages/ProviderManage";
import Provider from "@pages/Provider";
import Product from "@pages/Product";
import PrivacyPolicy from "@pages/PrivacyPolicy";
import Order from "@pages/Order";
import Login from "@pages/Login";
import LegalNotice from "@pages/LegalNotice";
import Error404 from "@pages/Error404";
import Contact from "@pages/Contact";
import CGU from "@pages/CGU";
import AdminProfil from "@pages/AdminProfil";
import Navbar from "@components/Navbar/Navbar";
import React from "react";
import Footer from "@components/Footer/Footer";
import PasswordMissing from "@pages/PasswordMissing";
import NewPassword from "@components/Login/NewPassword";
import NewPasswordUser from "@pages/NewPasswordUser";

function App() {
    return (
        <>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compte-utilisateur" element={<UserProfil />} />
            <Route path="/inscription" element={<Subscribe />} />
            <Route path="/boutique-manage" element={<StoreManage />} />
            <Route path="/stock-manage" element={<StockManage />} />
            <Route path="/fournisseur-manage" element={<ProviderManage />} />
            <Route path="/fournisseur" element={<Provider />} />
            <Route path="/produit" element={<Product />} />
            <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
            <Route path="/commande" element={<Order />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/notice-utilisation" element={<LegalNotice />} />
            <Route path="/page-non-trouve" element={<Error404 />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/condition-general-utilisation" element={<CGU />} />
            <Route path="/password-forgot" element={<PasswordMissing />} />
            <Route path="/new-password" element={<NewPasswordUser />} />
            <Route path="/compte-admin" element={<AdminProfil />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
           <Footer/>
       </>
    );
}

export default App;
