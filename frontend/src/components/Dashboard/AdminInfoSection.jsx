import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AdminInfoSection = () => {
  // État pour stocker les informations de l'admin récupérées depuis le backend
  const [admin, setAdmin] = useState(null);

  // Booléen pour vérifier si l'utilisateur est admin
  const [IsAdmin, setIsAdmin] = useState(true);

  // Stocke les messages d'erreur à afficher
  const [error, setError] = useState("");

  // Indique si l'utilisateur est connecté ou non
  const [isConnect, setIsConnect] = useState(false);

  // Indique si on est en mode édition du formulaire
  const [isEditing, setIsEditing] = useState(false);

  // Hook react-router pour navigation et lecture de l'URL courante
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect appelé au montage du composant pour récupérer les infos admin
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        // Requête axios GET pour récupérer le profil utilisateur (avec cookie)
        const response = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });
        setAdmin(response.data);
      } catch (err) {
        // En cas d'erreur, stocke un message d'erreur
        setError("Erreur lors du chargement des informations.");
      }
    };

    fetchAdminInfo();
  }, []);

  // Fonction qui récupère la session utilisateur et vérifie le rôle admin
  const fetchAllData = async () => {
    try {
      // Requête fetch GET avec cookie pour vérifier la session
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
        method: "GET",
        credentials: "include",
      });

      // Si la réponse n'est pas OK, redirige vers la page de connexion
      if (!res.ok) {
        setIsConnect(false);
        navigate("/connexion");
        return;
      }

      // Récupère les données utilisateur JSON
      const user = await res.json();

      // Vérifie si le rôle est différent d'admin et met à jour l'état IsAdmin
      if (user?.user?.role !== "admin") {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }

      // Met à jour l'état isConnect selon la présence d'un utilisateur
      setIsConnect(!!user?.user);
    } catch (error) {
      // En cas d'erreur, logue et marque comme non connecté
      console.error("Erreur lors de la récupération de la session :", error);
      setIsConnect(false);
    }
  };

  // useEffect pour lancer fetchAllData au montage du composant
  useEffect(() => {
    fetchAllData();
  }, []);

  // useEffect pour relancer fetchAllData à chaque changement d'URL (path)
  useEffect(() => {
    fetchAllData();
  }, [location.pathname]);

  // Schéma de validation Yup pour le formulaire d'édition admin
  const validationSchema = Yup.object({
    nom: Yup.string().required("Champ requis").min(3, "3 Caractères minimum"),
    prenom: Yup.string().required("Champ requis").min(3, "3 Caractères minimum"),
    email: Yup.string()
        .required("Email requis")
        .matches(
            /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/,
            "Format d'email invalide : au moins 3 caractères après @ et 2 pour l'extension"
        ),
    entreprise: Yup.string().required("Champ requis").min(3, "3 Caractères minimum"),
    pays: Yup.string().required("Champ requis").min(3, "3 Caractères minimum"),
    adresse: Yup.string().required("Champ requis").min(5, "5 Caractères minimum"),
    ville: Yup.string().required("Champ requis").min(3, "3 Caractères minimum"),
    postal: Yup.string()
        .required("Code postal requis")
        .matches(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres"),
    telephone: Yup.string()
        .required("Téléphone requis")
        .matches(/^\d{10}$/, "Le téléphone doit contenir exactement 10 chiffres"),
  });

  // Fonction appelée à la soumission du formulaire d'édition
  const handleSubmit = async (values) => {
    // On prépare un objet pour ne garder que les champs modifiés
    const updatedValues = {};

    for (const key in values) {
      if (values[key] !== admin[key]) {
        updatedValues[key] = values[key];
      }
    }

    // Si aucun champ modifié, on sort du mode édition
    if (Object.keys(updatedValues).length === 0) {
      setIsEditing(false); // rien à changer
      return;
    }

    try {
      // Requête PATCH pour mettre à jour les infos admin sur le backend
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/user/${admin.id_user}`, values, {
        withCredentials: true,
      });
      // Mise à jour locale des données admin
      setAdmin((prev) => ({ ...prev, ...values }));
      setIsEditing(false);
    } catch (error) {
      // En cas d'erreur, log et affichage message
      console.error("Erreur lors de la mise à jour :", error);
      setError("Erreur lors de la mise à jour.");
    }
  };

  // Si une erreur existe, l'affiche en rouge
  if (error) return <p className="text-red-500">{error}</p>;

  // Affiche un message de chargement si admin pas encore défini
  if (!admin) return <p className="text-white">Chargement...</p>;

  return (
      <div className="bg-gray-600 p-6 rounded-lg shadow text-white">
        {isConnect ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Mes informations</h2>

              {!isEditing ? (
                  <>
                    {/* Affichage simple des infos admin */}
                    <ul className="space-y-2">
                      <li><strong>Nom :</strong> {admin.nom || "—"} {admin.prenom || ""}</li>
                      <li><strong>Email :</strong> {admin.email || "—"}</li>
                      <li><strong>Rôle :</strong> {admin.role || "—"}</li>
                      <li><strong>Entreprise :</strong> {admin.entreprise || "—"}</li>
                      <li><strong>Pays :</strong> {admin.pays || "—"}</li>
                      <li><strong>Adresse :</strong> {(admin.adresse || "—") + ", " + (admin.ville || "") + " " + (admin.postal || "")}</li>
                      <li><strong>Téléphone :</strong> {admin.telephone || "—"}</li>
                    </ul>
                    {/* Bouton pour passer en mode édition */}
                    <button
                        aria-label="Bouton pour passer en édition"
                        onClick={() => setIsEditing(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Modifier mes informations
                    </button>
                  </>
              ) : (
                  // Formulaire d'édition avec Formik
                  <Formik
                      initialValues={{
                        nom: admin.nom || "",
                        prenom: admin.prenom || "",
                        email: admin.email || "",
                        entreprise: admin.entreprise || "",
                        pays: admin.pays || "",
                        adresse: admin.adresse || "",
                        ville: admin.ville || "",
                        postal: admin.postal || "",
                        telephone: admin.telephone || "",
                      }}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                  >
                    {() => (
                        <Form className="space-y-4 mt-4">
                          {/* Champs nom, prenom, email affichés seulement si admin */}
                          {IsAdmin && (
                              <>
                                <div>
                                  <label>Nom</label>
                                  <Field name="nom" className="w-full p-2 rounded text-black"/>
                                  <ErrorMessage name="nom" component="div" className="text-red-400 text-sm"/>
                                </div>
                              </>
                          )}

                          {IsAdmin && (
                              <>
                                <div>
                                  <label>Prénom</label>
                                  <Field name="prenom" className="w-full p-2 rounded text-black"/>
                                  <ErrorMessage name="prenom" component="div" className="text-red-400 text-sm"/>
                                </div>
                              </>
                          )}

                          {IsAdmin && (
                              <>
                                <div>
                                  <label>Email</label>
                                  <Field name="email" className="w-full p-2 rounded text-black"/>
                                  <ErrorMessage name="email" component="div" className="text-red-400 text-sm"/>
                                </div>
                              </>
                          )}

                          {/* Champs modifiables pour tous les utilisateurs */}
                          <div>
                            <label>Entreprise</label>
                            <Field name="entreprise" className="w-full p-2 rounded text-black"/>
                            <ErrorMessage name="entreprise" component="div" className="text-red-400 text-sm"/>
                          </div>
                          <div>
                            <label>Pays</label>
                            <Field name="pays" className="w-full p-2 rounded text-black"/>
                            <ErrorMessage name="pays" component="div" className="text-red-400 text-sm"/>
                          </div>
                          <div>
                            <label>Adresse</label>
                            <Field name="adresse" className="w-full p-2 rounded text-black"/>
                            <ErrorMessage name="adresse" component="div" className="text-red-400 text-sm"/>
                          </div>
                          <div>
                            <label>Ville</label>
                            <Field name="ville" className="w-full p-2 rounded text-black"/>
                            <ErrorMessage name="ville" component="div" className="text-red-400 text-sm"/>
                          </div>
                          <div>
                            <label>Code postal</label>
                            <Field name="postal" type="number" className="w-full p-2 rounded text-black"/>
                            <ErrorMessage name="postal" component="div" className="text-red-400 text-sm"/>
                          </div>
                          <div>
                            <label>Téléphone</label>
                            <Field name="telephone"
                                   type="tel"
                                   pattern="[0-9]*"
                                   inputMode="numeric"
                                   validation="matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
                                   className="w-full p-2 rounded text-black"/>
                            <ErrorMessage name="telephone" component="div" className="text-red-400 text-sm"/>
                          </div>

                          {/* Boutons sauvegarder et annuler */}
                          <div className="flex gap-4">
                            <button aria-label="Bouton de sauvegarde" type="submit" className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
                              Sauvegarder
                            </button>
                            <button
                                aria-label="Bouton d'annulation de l'opération"
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                            >
                              Annuler
                            </button>
                          </div>
                        </Form>
                    )}
                  </Formik>
              )}
            </>
        ) : (
            <div></div> // Si non connecté, on n'affiche rien
        )}
      </div>
  );
};

export default AdminInfoSection;
