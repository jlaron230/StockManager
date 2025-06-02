import AdminInfoSection from "@components/Dashboard/AdminInfoSection";
import UserSection from "@components/Dashboard/UserSection";
import StockAlertSection from "../components/Dashboard/StockAlertSection";
import StockChartSection from "../components/Dashboard/StockChartSection";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import LogoutUser from "@components/Login/LogoutUser";

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
      method: "GET",
      credentials: "include", // important pour envoyer le cookie
    })
        .then((res) => {
          if (!res.ok) {
            // Si non connecté, on redirige vers l'accueil
          } else {
            return res.json();
          }
        })
        .then((user) => {
          if (user?.user?.role !== "admin") {
            // Si connecté mais pas admin, on redirige aussi
            setIsAdmin(false);
          } else {
            setIsAdmin(true);
          }
          // Sinon, laisser l'accès à la page
        })
  }, []);

  return (
    <div className="p-6 space-y-10">
      {isAdmin ? (
      <h1 className="text-3xl font-bold text-center text-gray-800">Tableau de bord Admin</h1>
      ) : (
      <h1 className="text-3xl font-bold text-center text-gray-800">Tableau de bord</h1>
      )}
      <LogoutUser ButtonName="Déconnexion"/>
      <AdminInfoSection/>
      <UserSection/>
      <StockAlertSection/>
      <StockChartSection />
    </div>
  );
};

export default Dashboard;
