// Importation des hooks et bibliothèques nécessaires
import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import ButtonOrder from "@components/Button/ButtonOrder";
import ButtonReturn from "@components/Button/ButtonReturn";

const AddProduct = () => {
    // États pour gérer les autorisations, images, catégories et fournisseurs
    const [admin, setAdmin] = useState(false);
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);

    // Récupération des catégories et fournisseurs à l'initialisation du composant
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, { withCredentials: true })
            .then(res => setCategories(res.data))
            .catch(console.error);

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`, { withCredentials: true })
            .then(res => setProviders(res.data))
            .catch(console.error);
    }, []);

    const navigate = useNavigate();

    // Vérification de la session et du rôle utilisateur
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // important pour envoyer le cookie
        })
            .then((res) => {
                if (!res.ok) {
                    // Si non connecté, redirection vers la page de connexion
                    navigate("/connexion");
                } else {
                    return res.json();
                }
            })
            .then((user) => {
                if (user.user.role !== "admin") {
                    // Si connecté mais non admin, redirection également
                    navigate("/connexion");
                }
                // Si admin, accès autorisé à la page
            })
    }, []);

    // Valeurs initiales du formulaire
    const initialValues = {
        nom: "",
        seuil_minimal: 0,
        description: "",
        id_category: "",
        id_provider: "",
        localisation: "",
        code_product: "",
        quantité_en_stock: 0,
        prix_unitaire: 0,
        date_peremption: "",
        condition_achat: "",
    };

    // Schéma de validation avec Yup
    const validationSchema = Yup.object({
        nom: Yup.string().required("Champ requis").min(3, "3 Caractères minimum"),
        seuil_minimal: Yup.number().min(1, "Minimum 1").required("Champ requis"),
        description: Yup.string().required("Champ requis").min(10, "10 Caractères minimum"),
        id_category: Yup.string().required("Champ requis"),
        id_provider: Yup.string().required("Champ requis"),
        localisation: Yup.string().required("Champ requis").min(3, "3 Caractères minimum"),
        code_product: Yup.string().required("Champ requis").min(3, "3 Caractères minimum"),
        quantité_en_stock: Yup.number().min(0, "Minimum 0").required("Champ requis"),
        prix_unitaire: Yup.number().min(1, "Minimum 1").required("Champ requis"),
        date_peremption: Yup.date().nullable(),
        condition_achat: Yup.string().required("Champ requis").min(5, "5 Caractères minimum"),
    });

    // Gestion des images (ajout)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images, ...files];
        if (newImages.length > 3) {
            alert("Vous ne pouvez sélectionner que 3 images.");
            return;
        }
        setImages(newImages);
        e.target.value = null;
    };

    // Suppression d'une image sélectionnée
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    // Soumission du formulaire
    const handleSubmit = async (values, { resetForm }) => {
        try {
            const productData = {
                ...values,
                date_peremption: values.date_peremption ? values.date_peremption : null,
                image: null,
                document: null,
                image_prev: null,
                image_prev_two: null,
                id_admin: 1,
                date_add: new Date(),
                last_updated: new Date(),
                created_at: new Date(),
            };

            // Envoi des données au backend
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products`, productData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                },
            });

            // En cas de succès, redirection vers la page du produit
            if (response.status === 200 || response.status === 201) {
                alert("Produit ajouté !");
                const newProduct = response.data;
                navigate(`/produit/${newProduct.id_product}`);
                resetForm();
                setImages([]);
            } else {
                alert("Erreur lors de l'ajout.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Scroll vers le haut au chargement de la page
    useEffect(() => {
        window.scrollTo({ top, behavior: 'smooth' })
    }, [])

    // Rendu du formulaire
    return (
        <div className="flex justify-center">
            <main className="flex flex-wrap gap-8 justify-center m-10">
                {/* Bouton retour */}
                <div className="flex justify-start flex-col items-center">
                    <Link to="/produit">
                        <ButtonReturn className="flex flex-wrap" />
                    </Link>
                </div>

                {/* Formulaire Formik */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="w-full flex flex-wrap justify-center gap-6">
                            {/* Bloc gauche du formulaire */}
                            <div className="max-w-3xl p-6 bg-white rounded-2xl shadow">
                                <h1 className="text-2xl font-bold mb-4">Ajouter un produit</h1>

                                {/* Champs de saisie avec gestion des erreurs */}
                                {/* Nom du produit */}
                                {/* Seuil minimal */}
                                {/* Description */}
                                {/* Catégorie */}
                                {/* Fournisseur */}
                                {/* Localisation */}
                            </div>

                            {/* Bloc droit du formulaire */}
                            <div className="max-w-3xl p-6 bg-white rounded-2xl shadow">

                                {/* Code produit */}
                                {/* Quantité */}
                                {/* Prix unitaire */}
                                {/* Date de péremption */}
                                {/* Condition d'achat */}
                                {/* Upload d'images */}
                                {/* Aperçu des images sélectionnées */}

                                {/* Bouton de soumission */}
                                <ButtonOrder ButtonName="Ajouter le produit" buttonType="submit" />
                            </div>
                        </Form>
                    )}
                </Formik>
            </main>
        </div>
    );
};

export default AddProduct;
