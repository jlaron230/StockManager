import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import ButtonOrder from "@components/Button/ButtonOrder";
import ButtonReturn from "@components/Button/ButtonReturn";

const AddProduct = () => {
    const [admin, setAdmin] = useState(false);
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {withCredentials: true})
            .then(res => setCategories(res.data))
            .catch(console.error);

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`, {withCredentials: true})
            .then(res => setProviders(res.data))
            .catch(console.error);
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // important pour envoyer le cookie
        })
            .then((res) => {
                if (!res.ok) {
                    // Si non connecté, on redirige vers l'accueil
                    navigate("/connexion");
                } else {
                    return res.json();
                }
            })
            .then((user) => {
                if (user.user.role !== "admin") {
                    // Si connecté mais pas admin, on redirige aussi
                    navigate("/connexion");
                }
                // Sinon, laisser l'accès à la page
            })
    }, []);

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

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

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

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products`, productData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                },
            });

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

    useEffect(() => {
        window.scrollTo({top, behavior: 'smooth' })
    }, [])

    return (
        <div className="flex justify-center">
            <main className="flex flex-wrap gap-8 justify-center m-10">
                <div className="flex justify-start flex-col items-center">
                    <Link to="/produit">
                        <ButtonReturn className="flex flex-wrap"/>
                    </Link>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form className="w-full flex flex-wrap justify-center gap-6">
                            <div className="max-w-3xl p-6 bg-white rounded-2xl shadow">

                                <h1 className="text-2xl font-bold mb-4">Ajouter un produit</h1>

                                {/* Nom */}
                                <div className="mb-4">
                                    <label htmlFor="nom" className="block font-medium">Nom du produit</label>
                                    <Field name="nom" type="text" className="input w-full border p-2"/>
                                    <ErrorMessage name="nom" component="div" className="text-red-600 text-sm"/>
                                </div>

                                {/* Seuil */}
                                <div className="mb-4">
                                    <label htmlFor="seuil_minimal" className="block font-medium">Seuil minimal</label>
                                    <Field name="seuil_minimal" type="number" className="input w-full border p-2"/>
                                    <ErrorMessage name="seuil_minimal" component="div"
                                                  className="text-red-600 text-sm"/>
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label htmlFor="description" className="block font-medium">Description</label>
                                    <Field name="description" as="textarea" className="textarea w-full border p-2"/>
                                    <ErrorMessage name="description" component="div" className="text-red-600 text-sm"/>
                                </div>

                                {/* Catégorie */}
                                <div className="mb-4">
                                    <label htmlFor="id_category" className="block font-medium">Catégorie</label>
                                    <Field as="select" name="id_category" className="select w-full border p-2">
                                        <option value="">-- Choisir --</option>
                                        {categories.map(c => (
                                            <option key={c.id_category} value={c.id_category}>{c.nom}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="id_category" component="div" className="text-red-600 text-sm"/>
                                </div>

                                {/* Fournisseur */}
                                <div className="mb-4">
                                    <label htmlFor="id_provider" className="block font-medium">Fournisseur</label>
                                    <Field as="select" name="id_provider" className="select w-full border p-2">
                                        <option value="">-- Choisir --</option>
                                        {providers.map(p => (
                                            <option key={p.id_provider} value={p.id_provider}>{p.nom}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="id_provider" component="div" className="text-red-600 text-sm"/>
                                </div>

                                {/* Localisation */}
                                <div className="mb-4">
                                    <label htmlFor="localisation" className="block font-medium">Localisation</label>
                                    <Field name="localisation" type="text" className="input w-full border p-2"/>
                                    <ErrorMessage name="localisation" component="div" className="text-red-600 text-sm"/>
                                </div>
                            </div>

                            {/* Bloc droit */}
                            <div className="max-w-3xl p-6 bg-white rounded-2xl shadow">

                                {/* Code produit */}
                                <div className="mb-4">
                                    <label htmlFor="code_product" className="block font-medium">Code produit</label>
                                    <Field name="code_product" type="text" className="input w-full border p-2"/>
                                    <ErrorMessage name="code_product" component="div" className="text-red-600 text-sm"/>
                                </div>

                                {/* Quantité */}
                                <div className="mb-4">
                                    <label htmlFor="quantité_en_stock" className="block font-medium">Quantité</label>
                                    <Field name="quantité_en_stock" type="number" className="input w-full border p-2"/>
                                    <ErrorMessage name="quantité_en_stock" component="div"
                                                  className="text-red-600 text-sm"/>
                                </div>

                                {/* Prix */}
                                <div className="mb-4">
                                    <label htmlFor="prix_unitaire" className="block font-medium">Prix unitaire</label>
                                    <Field name="prix_unitaire" type="number" className="input w-full border p-2"/>
                                    <ErrorMessage name="prix_unitaire" component="div"
                                                  className="text-red-600 text-sm"/>
                                </div>

                                {/* Date de péremption */}
                                <div className="mb-4">
                                    <label htmlFor="date_peremption" className="block font-medium">Date de
                                        péremption</label>
                                    <Field name="date_peremption" type="date" className="input w-full border p-2"/>
                                    <ErrorMessage name="date_peremption" component="div"
                                                  className="text-red-600 text-sm"/>
                                </div>

                                {/* Condition d'achat */}
                                <div className="mb-4">
                                    <label htmlFor="condition_achat" className="block font-medium">Condition
                                        d'achat</label>
                                    <Field name="condition_achat" type="text" className="input w-full border p-2"/>
                                    <ErrorMessage name="condition_achat" component="div"
                                                  className="text-red-600 text-sm"/>
                                </div>

                                {/* Upload images */}
                                <div className="mb-4">
                                    <label htmlFor="images" className="block font-medium">Images (1 à 3)</label>
                                    <input type="file" multiple accept="image/*" onChange={handleImageChange}/>
                                </div>

                                {images.length > 0 && (
                                    <div className="flex gap-4 mb-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative">
                                                <img src={URL.createObjectURL(img)} alt={`img-${index}`}
                                                     className="w-24 h-24 object-cover rounded"/>
                                                <button
                                                    aria-label="Bouton ajout de produit"
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <ButtonOrder ButtonName="Ajouter le produit" buttonType="submit"/>
                            </div>
                        </Form>
                    )}
                </Formik>
            </main>
        </div>
    );
};

export default AddProduct;