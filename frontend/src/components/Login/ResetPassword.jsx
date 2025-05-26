import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/reset-password", {
        email,
        token,
        newPassword,
      });

      setMessage("Mot de passe mis à jour avec succès. Redirection...");
      setTimeout(() => {
        navigate("/connexion");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de la réinitialisation."
      );
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-6 py-8">
      <div className="w-full bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700 max-w-xl">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Réinitialisation du mot de passe
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nouveau mot de passe <span className="text-red-700">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {message && <p className="text-green-500 text-center">{message}</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
            >
              Réinitialiser
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
