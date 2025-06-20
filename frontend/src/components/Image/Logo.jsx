import logo from "@assets/image/LogoGestock.png";
import {Link} from "react-router-dom";
const Logo = () => {
    //composant du logo
    return (
        <>
            <Link to="/">
            <img src={logo} className="w-35" alt="Logo Gestock"/>
            </Link>
        </>
    )
}
export default Logo