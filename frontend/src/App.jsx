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

//firebase
import { useEffect, useState } from "react";
import { messaging, getToken } from "./firebase";

// ... toutes tes importations de routes et composants

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. Vérifie la session à l'ouverture
  useEffect(() => {
    fetch("http://localhost:5000/session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          console.log("🔐 Session active :", data.user);
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  // 2. Récupère et stocke le token FCM localement
  useEffect(() => {
    const fetchFcmToken = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BEdkve1KYu7rlujHqphLkZBmIZ8q3ou46FXu2SiJkmnhNflZUwuZpx7O6WLg9xZZa5aYpeZ4ONo2yD2U6488pD8",
        });
        if (token) {
          console.log("✅ Token FCM récupéré :", token);
          localStorage.setItem("fcm_token", token);
        }
      } catch (err) {
        console.error("❌ Erreur récupération FCM token :", err);
      }
    };

    fetchFcmToken();
  }, []);

  // 3. Si connecté → envoie le token au backend
  useEffect(() => {
    const token = localStorage.getItem("fcm_token");

    if (isLoggedIn && token) {
      fetch("http://localhost:5000/user/token", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ fcm_token: token }),
      })
        .then((res) => {
          if (res.ok) {
            console.log("📤 Token FCM envoyé au backend");
            localStorage.removeItem("fcm_token");
          }
        })
        .catch((err) => {
          console.error("❌ Envoi du token FCM échoué :", err);
        });
    }
  }, [isLoggedIn]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compte-utilisateur" element={<UserProfil />} />
        <Route path="/inscription" element={<Subscribe />} />
        <Route path="/boutique-manage" element={<StoreManage />} />
        <Route path="/stock-manage" element={<StockManage />} />
        <Route path="/fournisseur-manage" element={<ProviderManage />} />
        <Route path="/fournisseur" element={<Provider />} />
        <Route path="/produit" element={<Product />} />
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;

