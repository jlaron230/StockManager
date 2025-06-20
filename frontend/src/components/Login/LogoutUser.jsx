import {useEffect, useState} from "react";
import axios from "axios";

const LogoutUser = ({onClick, ButtonName, buttonType}) => {
    // Etat local pour stocker l'id de l'utilisateur connecté
    const [user, setUser] = useState(null);

    // useEffect pour récupérer les infos de session utilisateur au montage du composant
    useEffect(() => {
        sessionUser();
    }, []);

    // Fonction asynchrone qui appelle l'API backend pour obtenir la session utilisateur
    const sessionUser = async () => {
        try {
            // Requête GET vers /session avec les credentials pour récupérer l'utilisateur
            const res = axios.get(`${import.meta.env.VITE_BACKEND_URL}/session`, {
                withCredentials: true,
            });
            const response = await res;
            // Mise à jour du state avec l'id utilisateur
            setUser(response.data.user.id);
        } catch (error) {
            // Affiche l'erreur en console si échec
            console.log(error);
        }
    }

    // Fonction asynchrone pour déconnecter l'utilisateur
    const logout = async () => {
        try {
            // Requête POST vers /logout avec credentials
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {}, {
                method: "POST", withCredentials: true,
            });
            // Message console de succès
            console.log("Déconnexion réussie", response.data.message);
            // Redirection vers la page de connexion
            window.location.href = "/connexion";
            // Recharge la page pour reset l'état global
            window.location.reload();
        } catch(err) {
            // Affiche l'erreur en console si échec
            console.log(err);
        }
    }

    return (
        <>
            {/* Bouton qui appelle logout au clic */}
            <button
                type={buttonType}
                className="text-white Primary-Color from-purple-600 to-blue-500 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
                onClick={logout}
            >
                {ButtonName}
            </button>
        </>
    )
}
export default LogoutUser;
