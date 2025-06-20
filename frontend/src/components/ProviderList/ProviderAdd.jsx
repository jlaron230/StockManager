import {useEffect, useState} from "react";
import axios from "axios";
import {number} from "yup";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import ButtonOrder from "@components/Button/ButtonOrder";
import ButtonReturn from "@components/Button/ButtonReturn";

const ProviderAdd = () => {
    // État pour stocker les images sélectionnées (maximum 3)
    const [images, setImages] = useState([]);

    // État pour stocker les fournisseurs déjà existants
    const [provider, setprovider] = useState([]);

    // État pour stocker les types de fournisseurs
    const [providerTypes, setProviderTypes] = useState([]);

    // Gestion du changement d'images (limité à 3 fichiers)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images, ...files];
        if (newImages.length > 3) {
            alert("Vous ne pouvez sélectionner que 3 images au total.");
            return;
        }
        setImages(newImages);
        e.target.value = null;
    };

    console.log(images);

    const navigate = useNavigate();

    // 🔁 Récupération des types de fournisseurs au chargement
    useEffect(() => {
        const fetchProviderTypes = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/provider-types`, { withCredentials: true });
                setProviderTypes(res.data);
            } catch (error) {
                console.error("Erreur en récupérant les types de fournisseur :", error);
            }
        };
        fetchProviderTypes();
    }, []);

    // 🔐 Vérifie la session utilisateur (doit être admin)
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    navigate("/"); // Non connecté → redirection
                } else {
                    return res.json();
                }
            })
            .then((user) => {
                if (user.user.role !== "admin") {
                    navigate("/"); // Non admin → redirection
                }
            });
    }, []);

    // 📦 Récupération des fournisseurs existants
    useEffect(() => {
        const getProvider = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`, {withCredentials: true});
                setprovider(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getProvider();
    }, []);

    // ⬆️ Scroll automatique en haut de la page au chargement
    useEffect(() => {
        window.scrollTo({top, behavior: 'smooth' });
    }, []);

    // 🧾 Configuration du formulaire avec Formik + validation avec Yup
    const formik = useFormik({
        initialValues: {
            nom: "",
            email: "",
            telephone: "",
            type: "",
            adresse: "",
            codePostal: "",
            commentaire: "",
        },
        validationSchema: Yup.object({
            nom: Yup.string().required("Nom requis").min(3, "3 Caractères minimum"),
            email: Yup.string()
                .required("Email requis")
                .matches(
                    /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/,
                    "Format d'email invalide : au moins 3 caractères après @ et 2 pour l'extension"
                ),
            telephone: Yup.string()
                .required("Téléphone requis")
                .matches(/^\d{10}$/, "Le téléphone doit contenir exactement 10 chiffres"),
            type: Yup.string().required("Type requis"),
            adresse: Yup.string().required("Adresse requise").min(5, "5 Caractères minimum"),
            codePostal: Yup.string()
                .required("Code postal requis")
                .matches(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    nom: values.nom,
                    email: values.email,
                    telephone: values.telephone,
                    type: values.type,
                    adresse: values.adresse,
                    code_postal: values.codePostal,
                    commentaire: values.commentaire,
                };

                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/providers`, payload, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });

                if (response.status === 200 || response.status === 201) {
                    alert("Fournisseur ajouté !");
                    const newProvider = response.data;
                    navigate(`/fournisseur/${newProvider.id_provider}`);
                    resetForm();
                    setImages([]);
                } else {
                    alert("Erreur lors de l'ajout.");
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    return (
        <div className="flex justify-center">
            <main className="flex flex-wrap gap-8 justify-center m-10">
                {/* Bouton retour */}
                <Link to="/fournisseur">
                    <ButtonReturn className="flex flex-wrap"/>
                </Link>

                {/* Formulaire d'ajout de fournisseur */}
                <form className="w-full flex flex-wrap justify-center gap-10" onSubmit={formik.handleSubmit}>

                    {/* Colonne gauche */}
                    <div className="max-w-3xl p-6 bg-white rounded-2xl shadow">
                        <h1 className="text-2xl font-bold mb-4">Ajouter un fournisseur</h1>

                        {/* Champ Nom */}
                        <div className="mb-4">
                            <label htmlFor="nom" className="block font-medium">Nom</label>
                            <input
                                id="nom"
                                type="text"
                                className="input w-full border border-gray-300 rounded p-2"
                                {...formik.getFieldProps("nom")}
                            />
                            {formik.touched.nom && formik.errors.nom && (
                                <p className="text-red-500 text-sm">{formik.errors.nom}</p>
                            )}
                        </div>

                        {/* Champ Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block font-medium">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="input w-full border border-gray-300 rounded p-2"
                                {...formik.getFieldProps("email")}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-sm">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Champ Téléphone */}
                        <div className="mb-4">
                            <label htmlFor="telephone" className="block font-medium">Téléphone</label>
                            <input
                                type="tel"
                                id="telephone"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                validation="matches:/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
                                className="input w-full border border-gray-300 rounded p-2"
                                {...formik.getFieldProps("telephone")}
                            />
                            {formik.touched.telephone && formik.errors.telephone && (
                                <p className="text-red-500 text-sm">{formik.errors.telephone}</p>
                            )}
                        </div>

                        {/* Sélecteur Type */}
                        <div className="mb-4">
                            <label htmlFor="type" className="block font-medium">Type</label>
                            <select
                                id="type"
                                className="select w-full border border-gray-300 rounded p-2"
                                {...formik.getFieldProps("type")}
                            >
                                <option value="" disabled>-- Sélectionnez un type --</option>
                                {providerTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                            {formik.touched.type && formik.errors.type && (
                                <p className="text-red-500 text-sm">{formik.errors.type}</p>
                            )}
                        </div>

                        {/* Adresse */}
                        <div className="mb-4">
                            <label htmlFor="adresse" className="block font-medium">Adresse</label>
                            <input
                                id="adresse"
                                className="input w-full border border-gray-300 rounded p-2"
                                {...formik.getFieldProps("adresse")}
                            />
                            {formik.touched.adresse && formik.errors.adresse && (
                                <p className="text-red-500 text-sm">{formik.errors.adresse}</p>
                            )}
                        </div>
                    </div>

                    {/* Colonne droite */}
                    <div className="max-w-3xl p-6 bg-white rounded-2xl shadow">
                        {/* Code Postal */}
                        <div className="mb-4">
                            <label htmlFor="codePostal" className="block font-medium">Code postal</label>
                            <input
                                type="number"
                                id="codePostal"
                                className="input w-full border border-gray-300 rounded p-2"
                                {...formik.getFieldProps("codePostal")}
                            />
                            {formik.touched.codePostal && formik.errors.codePostal && (
                                <p className="text-red-500 text-sm">{formik.errors.codePostal}</p>
                            )}
                        </div>

                        {/* Commentaire */}
                        <div className="mb-4">
                            <label htmlFor="commentaire" className="block font-medium">Commentaire</label>
                            <input
                                id="commentaire"
                                className="input w-full border border-gray-300 rounded p-2"
                                {...formik.getFieldProps("commentaire")}
                            />
                            {formik.touched.commentaire && formik.errors.commentaire && (
                                <p className="text-red-500 text-sm">{formik.errors.commentaire}</p>
                            )}
                        </div>

                        {/* Bouton Soumission */}
                        <div className="mt-6">
                            <ButtonOrder  ButtonName="Ajouter le fournisseur" buttonType="submit"/>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ProviderAdd;
