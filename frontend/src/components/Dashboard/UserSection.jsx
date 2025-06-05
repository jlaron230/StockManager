import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [creationError, setCreationError] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isConnect, setIsConnect] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users", {
        withCredentials: true,
      });
      if (Array.isArray(res.data)) {
        setUsers(res.data);
        setError("");
      } else {
        throw new Error("Réponse inattendue");
      }
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
      setError("Erreur lors du chargement des utilisateurs.");
    }
  };

  const fetchAllData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
        method: "GET",
        credentials: "include", 
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

      if (user?.user?.role !== "admin") {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la session :", error);
      setIsConnect(false);
    }
  };

  useEffect(() => {
    fetchAllData(); 
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [location.pathname]);


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`http://localhost:5000/user/${id}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((u) => u.id_user !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { id_user, nom, prenom, email, role } = editingUser;
      await axios.patch(`http://localhost:5000/user/${id_user}`,
        { nom, prenom, email, role },
        { withCredentials: true }
      );
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <>
      {isConnect ? (
          <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex justify-between items-center text-left"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Utilisateurs
          </h2>
          <span className="text-2xl">{isOpen ? "−" : "+"}</span>
        </button>

        {isOpen && (
          <>
            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="overflow-x-auto mt-4">
              {isAdmin && (
              <button
                onClick={() => {
                  setCreationError("");
                  setNewUser({
                    nom: "",
                    prenom: "",
                    email: "",
                    password: "",
                    role: "employe",
                  });
                }}
                className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Ajouter un utilisateur
              </button>
              )}

              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Rôle</th>
                    {isAdmin && (
                    <th className="px-4 py-3 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id_user}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-4 py-3">{u.nom} {u.prenom}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3 capitalize">{u.role}</td>
                      {isAdmin && (
                      <td className="px-4 py-3 text-center space-x-2">
                        <button className="text-blue-500 hover:underline" onClick={() => setEditingUser(u)}>
                          Modifier
                        </button>
                        <button className="text-red-500 hover:underline" onClick={() => handleDelete(u.id_user)}>
                          Supprimer
                        </button>
                      </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* MODALE DE MODIFICATION */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all">
          <form
            onSubmit={handleUpdate}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-5 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold mb-2">Modifier l'utilisateur</h3>

            <input
              type="text"
              value={editingUser.nom}
              onChange={(e) => setEditingUser({ ...editingUser, nom: e.target.value })}
              placeholder="Nom"
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              value={editingUser.prenom}
              onChange={(e) => setEditingUser({ ...editingUser, prenom: e.target.value })}
              placeholder="Prénom"
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              placeholder="Email"
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="admin">Admin</option>
              <option value="responsable">Responsable</option>
              <option value="employe">Employé</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODALE DE CRÉATION */}
      {newUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.post("http://localhost:5000/user", newUser, {
                  withCredentials: true,
                });
                setNewUser(null);
                fetchUsers();
              } catch (err) {
                if (err.response?.status === 409) {
                  setCreationError("Cet email est déjà utilisé.");
                } else {
                  setCreationError("Erreur lors de la création.");
                }
              }
            }}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-5 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-bold mb-2">Nouvel utilisateur</h3>

            <input
              type="text"
              value={newUser.nom}
              onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
              placeholder="Nom"
              required
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              value={newUser.prenom}
              onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
              placeholder="Prénom"
              required
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email"
              required
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Mot de passe"
              required
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="responsable">Responsable</option>
              <option value="employe">Employé</option>
            </select>

            {creationError && (
              <p className="text-red-500 text-sm text-center">{creationError}</p>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setCreationError("");
                  setNewUser(null);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      )}
          </>
      ) : (
          <></>
      )}
    </>
  );
};

export default UserSection;
