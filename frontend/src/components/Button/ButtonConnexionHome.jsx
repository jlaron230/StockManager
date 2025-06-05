import {Link} from "react-router-dom";

const ButtonConnexionHome = () => {
    return (
        <Link to="/connexion">
            <button type="submit"
                    className="hover:scale-110 transition duration-300 bg-white text-color-default-2  hover:Primary-Color focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center me-2">
                Connexion</button>
        </Link>
    )
}
export default ButtonConnexionHome