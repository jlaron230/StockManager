import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

// ✅ Import des pages principales de l'application
import Home from "./pages/Home";
import Subscribe from "@pages/Subscribe";
import StoreManage from "@pages/StoreManage";
import ProviderManage from "@pages/ProviderManage";
import Provider from "@pages/Provider";
import Product from "@pages/Product";
import PrivacyPolicy from "@pages/PrivacyPolicy";
import Login from "@pages/Login";
import LegalNotice from "@pages/LegalNotice";
import Error404 from "@pages/Error404";
import CGU from "@pages/CGU";
import PasswordMissing from "@pages/PasswordMissing";
import NewPasswordUser from "@pages/NewPasswordUser";
import ProductCrud from "@components/ProductsList/ProductCrud";
import AddProduct from "@components/ProductsList/AddProduct";
import ProductAdd from "@pages/ProductAdd";
import ProviderAdd from "@components/ProviderList/ProviderAdd";
import AddProvider from "@pages/AddProvider";
import OrderManagement from "@pages/OrderManagement";
import ResetPassword from "@pages/ResetPassword";
import Dashboard from "@pages/Dashboard";
import About from "@pages/About";

// ✅ Import des composants communs
import Navbar from "@components/Navbar/Navbar";
import Footer from "@components/Footer/Footer";
import ScrollToTopBar from "@components/Button/ScrollToTopBar";

// ✅ Import Firebase pour FCM (notifications push)
import { messaging, getToken } from "./firebase";

import React, { useEffect, useState } from "react";

function App() {
    // ⚙️ État de connexion utilisateur
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 🟡 Étape 1 : Vérifie la session utilisateur au chargement
    useEffect(() => {
        fetch("http://localhost:5000/session", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.user) {
                   // console.log("🔐 Session active :", data.user);
                    setIsLoggedIn(true);
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
            });
    }, []);

    // 🟡 Étape 2 : Récupère le token Firebase Cloud Messaging (FCM)
    useEffect(() => {
        const fetchFcmToken = async () => {
            try {
                const token = await getToken(messaging, {
                    vapidKey:
                        "BEdkve1KYu7rlujHqphLkZBmIZ8q3ou46FXu2SiJkmnhNflZUwuZpx7O6WLg9xZZa5aYpeZ4ONo2yD2U6488pD8",
                });
                if (token) {
                 //   console.log("✅ Token FCM récupéré :", token);
                    localStorage.setItem("fcm_token", token);
                }
            } catch (err) {
                console.error("❌ Erreur récupération FCM token :", err);
            }
        };

        fetchFcmToken();
    }, []);

    // 🟡 Étape 3 : Envoie le token FCM au backend si utilisateur connecté
    useEffect(() => {
        const token = localStorage.getItem("fcm_token");

        const sendFcmToken = async () => {
            if (isLoggedIn && token) {
                try {
                    // ⚠️ Réveille la session pour éviter un token expiré
                    await fetch("http://localhost:5000/session", {
                        method: "GET",
                        credentials: "include",
                    });

                    // 🚀 Envoi du token FCM au backend
                    const res = await fetch("http://localhost:5000/user/token", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ fcm_token: token }),
                    });

                    if (res.ok) {
                      //  console.log("✅ Token FCM envoyé au backend");
                        localStorage.removeItem("fcm_token");
                    } else {
                        console.error("❌ Échec lors de l'envoi du token FCM");
                    }
                } catch (err) {
                    console.error("❌ Erreur fetch FCM token :", err);
                }
            }
        };

        sendFcmToken();
    }, [isLoggedIn]);

    // 🔁 Affichage global de l'application avec la navigation
    return (
        <>
            {/* Barre de navigation persistante */}
            <Navbar />
            {/* Bouton pour remonter en haut de la page */}
            <ScrollToTopBar />

            {/* Déclaration des routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/inscription" element={<Subscribe />} />
                <Route path="/boutique-manage" element={<StoreManage />} />
                <Route path="/fournisseur/:id" element={<ProviderManage />} />
                <Route path="/fournisseur" element={<Provider />} />
                <Route path="/ajout-provider" element={<AddProvider />} />
                <Route path="/produit" element={<Product />} />
                <Route path="/ajout-produit" element={<ProductAdd />} />
                <Route path="/produit/:id" element={<ProductCrud />} />
                <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
                <Route path="/commande-gestion" element={<OrderManagement />} />
                <Route path="/connexion" element={<Login />} />
                <Route path="/notice-utilisation" element={<LegalNotice />} />
                <Route path="/page-non-trouve" element={<Error404 />} />
                <Route path="/condition-general-utilisation" element={<CGU />} />
                <Route path="/password-forgot" element={<PasswordMissing />} />
                <Route path="/new-password" element={<NewPasswordUser />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/Dashboard" element={<Dashboard />} />

                {/* Route fallback en cas d'URL non reconnue */}
                <Route path="*" element={<Error404 />} />
            </Routes>

            {/* Pied de page persistant */}
            <Footer />
        </>
    );
}

export default App;
