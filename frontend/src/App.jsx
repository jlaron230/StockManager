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
import ProductCrud from "@components/ProductsList/ProductCrud";
import AddProduct from "@components/ProductsList/AddProduct";
import ProductAdd from "@pages/ProductAdd";
import ProviderAdd from "@components/ProviderList/ProviderAdd";
import AddProvider from "@pages/AddProvider";
import ResetPassword from "@pages/ResetPassword";
import Dashboard from "@pages/Dashboard"; 

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
            <Route path="/fournisseur/:id" element={<ProviderManage />} />
            <Route path="/fournisseur" element={<Provider />} />
            <Route path="/ajout-provider" element={<AddProvider />} />
            <Route path="/produit" element={<Product />} />
            <Route path="/ajout-produit" element={<ProductAdd />} />
            <Route path="/produit/:id" element={<ProductCrud />} />
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
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
           <Footer/>
       </>
    );
}

export default App;
