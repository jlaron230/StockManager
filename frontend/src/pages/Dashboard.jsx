import AdminInfoSection from "@components/Dashboard/AdminInfoSection";
import UserSection from "@components/Dashboard/UserSection";
import StockAlertSection from "../components/Dashboard/StockAlertSection";
import StockChartSection from "../components/Dashboard/StockChartSection";
import { useEffect, useState } from "react";
import LogoutUser from "@components/Login/LogoutUser";
import CategorySection from "@components/Dashboard/CategorySection";

// 🧠 Composant principal du tableau de bord
// Affiche différentes sections selon le rôle de l'utilisateur connecté
const Dashboard = () => {
    // 🔐 État pour savoir si l'utilisateur est admin
    const [isAdmin, setIsAdmin] = useState(true);

    // 🕵️‍♀️ useEffect pour vérifier la session utilisateur à l'arrivée sur la page
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // ⬅️ Nécessaire pour inclure les cookies de session
        })
            .then((res) => {
                if (!res.ok) {
                    // ❌ Si la requête échoue (non connecté), rien n'est fait ici,
                    // mais tu pourrais rediriger vers "/connexion" par exemple
                } else {
                    return res.json(); // ✅ On récupère les infos utilisateur
                }
            })
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    // Si ce n’est pas un admin, on désactive les sections admin
                    setIsAdmin(false);
                } else {
                    // Sinon, c’est un admin : on garde l'accès complet
                    setIsAdmin(true);
                }
            });
    }, []);

    return (
        <div className="p-6 space-y-10">
            {/* 🧾 Titre conditionnel selon le rôle */}
            {isAdmin ? (
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Tableau de bord Admin
                </h1>
            ) : (
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Tableau de bord
                </h1>
            )}

            {/* 🔓 Bouton de déconnexion */}
            <LogoutUser ButtonName="Déconnexion" />

            {/* 📊 Différentes sections du dashboard */}
            <AdminInfoSection />
            <UserSection />
            <CategorySection />
            <StockAlertSection />
            <StockChartSection />
        </div>
    );
};

export default Dashboard;
