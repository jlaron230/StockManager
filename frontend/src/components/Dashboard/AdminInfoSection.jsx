import { useEffect, useState } from "react";
import axios from "axios";

const AdminInfoSection = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");

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

if (error) return <p className="text-red-500">{error}</p>;
if (!admin) return <p className="text-white">Chargement...</p>;

return (
  <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
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
  </div>
);

  
};

export default AdminInfoSection;
