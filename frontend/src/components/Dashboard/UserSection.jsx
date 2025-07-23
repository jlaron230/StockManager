import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const UserSection = () => {
  // États pour gérer les utilisateurs, erreurs, édition, création, affichage, etc.
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [creationError, setCreationError] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [isConnect, setIsConnect] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [IsActiveNewUser, setIsActiveNewUser] = useState(false);

  // Récupère la liste des utilisateurs depuis l'API
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

  // Récupère la session utilisateur pour vérifier si connecté et rôle admin
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

  // Au montage, on vérifie la session
  useEffect(() => {
    fetchAllData();
  }, []);

  // A chaque changement d'URL, on re-vérifie la session (ex: déconnexion)
  useEffect(() => {
    fetchAllData();
  }, [location.pathname]);

  // Au montage, on charge la liste des utilisateurs
  useEffect(() => {
    fetchUsers();
  }, []);

  // Supprime un utilisateur après confirmation
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

  // Met à jour un utilisateur édité
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

  // Gestion du scroll sur la liste pour déclencher une animation temporaire
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const currentScroll = scrollRef.current.scrollTop;
        setScrollTop(currentScroll);

        if (currentScroll >= 300) {
          setIsActiveNewUser(true);
          // Après 5 secondes, on enlève l'effet actif
          setTimeout(() => {
            console.log("Delayed for 5 seconds.");
            setIsActiveNewUser(false);
          }, 5000);
        }
      }
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, [IsActiveNewUser]);

  console.log(IsActiveNewUser);

  return (
      <>
        {isConnect ? (
            <>
              {/* Section principale affichant les utilisateurs */}
              <div ref={scrollRef} style={{ maxHeight: "400px", overflowY: "auto" }} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
                <button
                    aria-label="Affichage utilisateur"
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
                      {/* Affiche une erreur si elle existe */}
                      {error && <p className="text-red-500 mt-4">{error}</p>}

                      <div className="overflow-x-auto mt-4">
                        {/* Bouton création visible seulement aux admins */}
                        {isAdmin && (
                            <button
                                aria-label="Bouton de création"
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

                        {/* Tableau des utilisateurs */}
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
                          {/* Affiche les utilisateurs avec rôle admin, responsable ou employé */}
                          {users
                              .filter((u) => ["admin", "responsable", "employe"].includes(u.role))
                              .map((u) => (
                                  <tr
                                      key={u.id_user}
                                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                  >
                                    <td className="px-4 py-3">{u.nom} {u.prenom}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3 capitalize">{u.role}</td>
                                    {isAdmin && (
                                        <td className="px-4 py-3 text-center space-x-2">
                                          <button  aria-label="Bouton de modification d'un user" className="text-blue-500 hover:underline" onClick={() => setEditingUser(u)}>
                                            Modifier
                                          </button>
                                          <button aria-label="Bouton de suppression d'un user" className="text-red-500 hover:underline" onClick={() => handleDelete(u.id_user)}>
                                            Supprimer
                                          </button>
                                        </td>
                                    )}
                                  </tr>
                              ))}

                          {/* Affiche les utilisateurs avec autres rôles, avec animation scroll */}
                          {users
                              .filter((u) => !["admin", "responsable", "employe"].includes(u.role))
                              .map((u) => (
                                  <tr
                                      key={u.id_user}
                                      className={`border-b dark:bg-blue-500 dark:border-black ${IsActiveNewUser ? `bg-blue-300 transition delay-150 duration-300` : `bg-white transition delay-150 duration-300`} `}
                                  >
                                    <td className={`px-4 py-3 ${IsActiveNewUser ? `text-2xl transition delay-150 duration-300` : `text-base transition delay-150 duration-300`}`}>{u.nom} {u.prenom}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3 capitalize">{u.role}</td>
                                    {isAdmin && (
                                        <td className="px-4 py-3 text-center space-x-2">
                                          <button
                                              aria-label="Bouton de modification"
                                              className="text-blue-500 hover:underline" onClick={() => setEditingUser(u)}>
                                            Modifier
                                          </button>
                                          <button
                                              aria-label="Bouton de suppression"
                                              className="text-red-500 hover:underline"
                                                  onClick={() => handleDelete(u.id_user)}>
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
                  <div
                      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all">
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-5 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-xl font-bold mb-2">Modifier l'utilisateur</h3>

                      {/* Champs pour modifier le nom */}
                      <input
                          type="text"
                          value={editingUser.nom}
                          onChange={(e) => setEditingUser({...editingUser, nom: e.target.value})}
                          placeholder="Nom"
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                      />

                      {/* Champs pour modifier le prénom */}
                      <input
                          type="text"
                          value={editingUser.prenom}
                          onChange={(e) => setEditingUser({ ...editingUser, prenom: e.target.value })}
                          placeholder="Prénom"
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                      />

                      {/* Champs pour modifier l'email */}
                      <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          placeholder="Email"
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                      />

                      {/* Sélecteur de rôle */}
                      <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                      >
                        <option value="admin">Admin</option>
                        <option value="responsable">Responsable</option>
                        <option value="employe">Employé</option>
                        <option value="stagiaire">Stagiaire</option>
                      </select>

                      <div className="flex justify-end space-x-4">
                        <button
                            aria-label="Bouton d'annulation"
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
                        >
                          Annuler
                        </button>
                        <button
                            aria-label="bouton de sauvegarde"
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </form>
                  </div>
              )}

              {/* MODALE DE CREATION */}
              {newUser && (
                  <div
                      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all">
                    <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            const res = await axios.post("http://localhost:5000/user", newUser, { withCredentials: true });
                            if (res.status === 201) {
                              setNewUser(null);
                              setCreationError("");
                              fetchUsers();
                            } else {
                              setCreationError("Erreur lors de la création.");
                            }
                          } catch (err) {
                            setCreationError("Erreur lors de la création.");
                          }
                        }}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-5 border border-gray-200 dark:border-gray-700"
                    >
                      <h3 className="text-xl font-bold mb-2">Ajouter un utilisateur</h3>

                      {/* Champs pour le nom */}
                      <input
                          type="text"
                          value={newUser.nom}
                          onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                          placeholder="Nom"
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                      />

                      {/* Champs pour le prénom */}
                      <input
                          type="text"
                          value={newUser.prenom}
                          onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                          placeholder="Prénom"
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                      />

                      {/* Champs pour l'email */}
                      <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="Email"
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                      />

                      {/* Champs pour le mot de passe */}
                      <input
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="Mot de passe"
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                      />

                      {/* Sélecteur de rôle */}
                      <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                      >
                        <option value="admin">Admin</option>
                        <option value="responsable">Responsable</option>
                        <option value="employe">Employé</option>
                        <option value="stagiaire">Stagiaire</option>
                      </select>

                      {/* Affiche l'erreur de création si existante */}
                      {creationError && <p className="text-red-500">{creationError}</p>}

                      <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setNewUser(null)}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-700"
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
            <p>Connexion requise pour afficher les utilisateurs.</p>
        )}
      </>
  );
};

export default UserSection;
