import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";

const CategorySection = () => {
    // État pour gérer l'ouverture/fermeture de la section catégories
    const [isOpen, setIsOpen] = useState(false);
    // Stocke la liste des catégories récupérées depuis le backend
    const [categories, setCategories] = useState([]);
    // ID de la catégorie en cours d'édition
    const [editingCategory, setEditingCategory] = useState(null);
    // Valeur modifiée lors de l'édition d'une catégorie
    const [editingValue, setEditingValue] = useState("");
    // Booléen indiquant si l'utilisateur est admin
    const [isAdmin, setIsAdmin] = useState(true);
    // Booléen indiquant si l'utilisateur est connecté
    const [isConnect, setIsConnect] = useState(false);

    // Valeurs initiales du formulaire d'ajout de catégorie
    const initialValues = {
        nom: "",
    };

    // Charge les catégories dès le montage du composant
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fonction pour récupérer les catégories depuis l'API
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {withCredentials: true});
            setCategories(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Suppression d'une catégorie après confirmation
    const deleteCategory = async (id) => {
        if (!window.confirm("Supprimer cet utilisateur ?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/${id}`, {withCredentials: true});
            fetchCategories(); // Recharge la liste après suppression
        } catch (err) {
            console.log(err);
        }
    }

    // Démarrer l'édition d'une catégorie : on sauvegarde son ID et sa valeur
    const startEditing = (id, nom) => {
        setEditingCategory(id);
        setEditingValue(nom);
    };

    // Annuler l'édition en remettant les valeurs à null
    const cancelEditing = () => {
        setEditingCategory(null);
        setEditingValue("");
    };

    // Mettre à jour une catégorie sur le serveur
    const handleUpdate = async (id) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/categories/${id}`,
                {nom: editingValue},
                {withCredentials: true},
            );
            setEditingCategory(null); // Quitte le mode édition
            fetchCategories(); // Recharge les catégories modifiées
        } catch (err) {
            alert("Erreur lors de la mise à jour.");
        }
    };

    // Schéma de validation pour le formulaire d'ajout (Formik + Yup)
    const validationSchema = Yup.object({
        nom: Yup.string().required("Champ requis").min(3, "3 Caractères minimum"),
    });

    const navigate = useNavigate();

    // Vérification de la session utilisateur pour savoir si connecté et admin
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // envoie le cookie de session
        })
            .then((res) => {
                if (!res.ok) {
                    navigate("/connexion"); // redirection si non connecté
                    setIsConnect(false);
                } else {
                    setIsConnect(true);
                    return res.json();
                }
            })
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    setIsAdmin(false); // pas admin => accès limité
                } else {
                    setIsAdmin(true);
                }
            });
    }, []);

    // Gestion de la soumission du formulaire d'ajout de catégorie
    const handleSubmit = async (values, {resetForm}) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/categories`,
                values,
                {
                    headers: {"Content-Type": "application/json"},
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert("Catégorie ajoutée !");
                resetForm(); // réinitialise le formulaire
                fetchCategories(); // recharge la liste
            } else {
                alert("Erreur lors de l'ajout.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
            {/* Bouton pour ouvrir/fermer la section */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-full flex justify-between items-center text-left"
            >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Catégories
                </h2>
                <span className="text-2xl">{isOpen ? "−" : "+"}</span>
            </button>

            {/* Contenu visible uniquement si la section est ouverte */}
            {isOpen && (
                <div className="mt-4 space-y-8">
                    {/* Formulaire d'ajout de catégorie (visible uniquement aux admins) */}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <>
                                {isAdmin && (
                                    <Form className="w-full space-y-4">

                                        <div>
                                            <label
                                                htmlFor="nom"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Nom de la catégorie
                                            </label>
                                            <Field
                                                name="nom"
                                                type="text"
                                                placeholder="Ex: Informatique"
                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                            <ErrorMessage
                                                name="nom"
                                                component="div"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Ajouter
                                            </button>
                                        </div>

                                    </Form>
                                )}
                            </>
                        )}
                    </Formik>

                    {/* Tableau affichant la liste des catégories */}
                    {categories.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
                                <thead className="bg-gray-100 dark:bg-gray-700 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-4 py-2">ID</th>
                                    <th className="px-4 py-2">Nom</th>
                                    {isAdmin && (
                                        <th className="px-4 py-2">Actions</th>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {categories.map((cat) => (
                                    <tr
                                        key={cat.id_category}
                                        className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-4 py-2">{cat.id_category}</td>
                                        <td className="px-4 py-2">
                                            {editingCategory === cat.id_category ? (
                                                // Si la catégorie est en mode édition, afficher un input
                                                <input
                                                    type="text"
                                                    value={editingValue}
                                                    onChange={(e) => setEditingValue(e.target.value)}
                                                    className="w-full p-1 rounded border dark:bg-gray-700"
                                                />
                                            ) : (
                                                // Sinon afficher le nom en lecture seule
                                                cat.nom
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-4 py-2 flex gap-2">
                                                {editingCategory === cat.id_category ? (
                                                    // Boutons sauvegarder / annuler lors de l'édition
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdate(cat.id_category)}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            Sauvegarder
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="text-gray-500 hover:underline"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </>
                                                ) : (
                                                    // Boutons modifier / supprimer en mode normal
                                                    <>
                                                        <button
                                                            onClick={() => startEditing(cat.id_category, cat.nom)}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCategory(cat.id_category)}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default CategorySection;
