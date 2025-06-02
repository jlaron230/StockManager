import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const AdminInfoSection = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const [isConnect, setIsConnect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true, 
        });
        setAdmin(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des informations.");
      }
    };

    fetchAdminInfo();
  }, []);

  const fetchAllData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
        method: "GET",
        credentials: "include", // important pour envoyer le cookie
      });

      if (!res.ok) {
        setIsConnect(false);
        navigate("/connexion")
        return;
      }

      const user = await res.json();

      if (user?.user) {
        setIsConnect(true);
      } else {
        setIsConnect(false);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la session :", error);
      setIsConnect(false);
    }
  };

  useEffect(() => {
    fetchAllData(); // au premier chargement
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [location.pathname]);

if (error) return <p className="text-red-500">{error}</p>;
if (!admin) return <p className="text-white">Chargement...</p>;

return (
  <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
    {isConnect ? (
        <>
    <h2 className="text-xl font-semibold mb-4">Mes informations</h2>
    <ul className="space-y-2">
      <li>
        <strong>Nom :</strong> {admin.nom || "—"} {admin.prenom || ""}
      </li>
      <li>
        <strong>Email :</strong> {admin.email || "—"}
      </li>
      <li>
        <strong>Rôle :</strong> {admin.role || "—"}
      </li>
      <li>
        <strong>Entreprise :</strong> {admin.entreprise || "—"}
      </li>
      <li>
        <strong>Pays :</strong> {admin.pays || "—"}
      </li>
      <li>
        <strong>Adresse :</strong>{" "}
        {(admin.adresse || "—") + ", " + (admin.ville || "") + " " + (admin.postal || "")}
      </li>
      <li>
        <strong>Téléphone :</strong> {admin.telephone || "—"}
      </li>
    </ul>
        </>
      ) : (
          <div>
          </div>
      )}
  </div>
);


};

export default AdminInfoSection;
