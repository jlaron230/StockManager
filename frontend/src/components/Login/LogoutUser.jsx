import {useEffect, useState} from "react";
import axios from "axios";

const LogoutUser = ({onClick, ButtonName, buttonType}) => {
    const [user, setUser] = useState(null);

    useEffect( () => {
        sessionUser()
    }, [])

    const sessionUser = async () => {
        try {
            const res = axios.get(`${import.meta.env.VITE_BACKEND_URL}/session`, {
                withCredentials: true,
            })
            const response = await res;
            setUser(response.data.user.id);
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async() => {
        try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {}, {
            method: "POST", withCredentials: true,
        })
            console.log("Déconnexion réussie", response.data.message)
            window.location.href = "/connexion"

    }catch(err) {
            console.log(err)
        }
    }

  return (
      <>
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
export default LogoutUser