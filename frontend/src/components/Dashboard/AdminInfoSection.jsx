import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AdminInfoSection = () => {
  const [admin, setAdmin] = useState(null);
  const [IsAdmin, setIsAdmin] = useState(true);
  const [error, setError] = useState("");
  const [isConnect, setIsConnect] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/profile", {
          withCredentials: true,
        });
        setAdmin(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des informations.");
      }
    };

    fetchAdminInfo();
  }, []);

  const fetchAllData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setIsConnect(false);
        navigate("/connexion");
        return;
      }

      const user = await res.json();
      if (user?.user?.role !== "admin") {

        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }

      setIsConnect(!!user?.user);
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
    telephone: Yup.string().required("Téléphone requis") .matches(/^\d{10}$/, "Le téléphone doit contenir exactement 10 chiffres"),
  });

  const handleSubmit = async (values) => {
    const updatedValues = {};

    for (const key in values) {
      if (values[key] !== admin[key]) {
        updatedValues[key] = values[key];
      }
    }

    if (Object.keys(updatedValues).length === 0) {
      setIsEditing(false); // rien à changer
      return;
    }

    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/user/${admin.id_user}`, values, {
        withCredentials: true,
      });
      setAdmin((prev) => ({ ...prev, ...values }));
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setError("Erreur lors de la mise à jour.");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!admin) return <p className="text-white">Chargement...</p>;

  return (
      <div className="bg-gray-600 p-6 rounded-lg shadow text-white">
        {isConnect ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Mes informations</h2>

              {!isEditing ? (
                  <>
                    <ul className="space-y-2">
                      <li><strong>Nom :</strong> {admin.nom || "—"} {admin.prenom || ""}</li>
                      <li><strong>Email :</strong> {admin.email || "—"}</li>
                      <li><strong>Rôle :</strong> {admin.role || "—"}</li>
                      <li><strong>Entreprise :</strong> {admin.entreprise || "—"}</li>
                      <li><strong>Pays :</strong> {admin.pays || "—"}</li>
                      <li><strong>Adresse :</strong> {(admin.adresse || "—") + ", " + (admin.ville || "") + " " + (admin.postal || "")}</li>
                      <li><strong>Téléphone :</strong> {admin.telephone || "—"}</li>
                    </ul>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Modifier mes informations
                    </button>
                  </>
              ) : (
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
                                   validation="matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/" className="w-full p-2 rounded text-black"/>
                            <ErrorMessage name="telephone" component="div" className="text-red-400 text-sm"/>
                          </div>

                          <div className="flex gap-4">
                            <button type="submit" className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
                              Sauvegarder
                            </button>
                            <button
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
            <div></div>
        )}
      </div>
  );
};

export default AdminInfoSection;
