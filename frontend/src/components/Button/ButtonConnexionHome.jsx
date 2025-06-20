import { Link } from "react-router-dom";

// Composant bouton qui redirige vers une route donnée via Link
const ButtonConnexionHome = ({ connexion, Onclick, ButtonName }) => {
    return (
        <Link to={connexion}>
            {/* Bouton avec effet au survol et gestion du clic */}
            <button
                type="submit"
                onClick={Onclick}
                className="hover:scale-110 transition duration-300 bg-white text-color-default-2 hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2"
            >
                {ButtonName}
            </button>
        </Link>
    );
};

export default ButtonConnexionHome;
