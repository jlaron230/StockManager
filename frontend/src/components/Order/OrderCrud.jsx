import { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import axios from "axios";
import ButtonOrder from "@components/Button/ButtonOrder";
import {useNavigate} from "react-router-dom";

const OrderCrud = () => {
    const [isAdmin, setIsAdmin] = useState(true);
    const [providers, setProviders] = useState([]);
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [total, setTotal] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // important pour envoyer le cookie
        })
            .then((res) => {
                if (!res.ok) {
                    navigate("/")
                    // Si non connecté, on redirige vers l'accueil
                } else {
                    return res.json();
                }
            })
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    // Si connecté mais pas admin, on redirige aussi
                    setIsAdmin(false);
                    navigate("/")
                } else {
                    setIsAdmin(true);
                }
                // Sinon, laisser l'accès à la page
            })
    }, []);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`).then((res) => setProviders(res.data));
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`).then((res) => setProducts(res.data));
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/session`, { withCredentials: true })
            .then((res) => setUser(res.data.user.id));
    }, []);

    return (
        <>
        {isAdmin ? (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Créer une commande</h1>

            <Formik
                initialValues={{
                    id_provider: "",
                    products: [],
                    date_commande: new Date().toISOString(),
                    statut: "en cours",
                    id_user: null,
                }}
                onSubmit={async (values, { resetForm }) => {
                    // Validation côté client (sécurité + UX)
                    const providerProducts = products.filter(
                        (p) => p.id_provider === Number(values.id_provider)
                    );

                    const allMatch = values.products.every((prod) =>
                        providerProducts.some((p) => p.id_product === Number(prod.id_product))
                    );

                    if (!allMatch) {
                        alert("Tous les produits doivent appartenir au même fournisseur.");
                        return;
                    }

                    if (!window.confirm(`Valider cette commande pour un montant total de ${total.toFixed(2)} € ?`)) return;

                    try {
                        const payload = {
                            ...values,
                            id_provider: Number(values.id_provider),
                            id_user: Number(values.id_user),
                            products: values.products.map((p) => ({
                                id_product: Number(p.id_product),
                                quantité: Number(p.quantité),
                            })),
                        };

                        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/orders`, payload, {
                            withCredentials: true
                        });
                        alert("Commande créée avec succès !");
                        resetForm();
                        setTotal(0);
                    } catch (err) {
                        console.error("Erreur axios :", err.response?.data || err.message);
                        alert("Erreur lors de la création de la commande.");
                    }
                }}
            >
                {({ values, setFieldValue }) => {
                    useEffect(() => {
                        const filtered = products.filter(
                            (p) => p.id_provider === Number(values.id_provider)
                        );
                        setFilteredProducts(filtered);
                        // Réinitialise les produits si le fournisseur change
                        setFieldValue("products", []);
                    }, [values.id_provider]);

                    useEffect(() => {
                        if (user) {
                            setFieldValue("id_user", user);
                        }
                    }, [user]);

                    useEffect(() => {
                        const t = values.products.reduce((sum, p) => {
                            const prod = filteredProducts.find((fp) => fp.id_product === Number(p.id_product));
                            return sum + (prod ? prod.prix_unitaire * p.quantité : 0);
                        }, 0);
                        setTotal(t);
                    }, [values.products, filteredProducts]);

                    return (
                        <Form className="space-y-6">
                            <div>
                                <label className="block mb-1">Fournisseur</label>
                                <Field
                                    as="select"
                                    name="id_provider"
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">-- Choisir un fournisseur --</option>
                                    {providers.map((provider) => (
                                        <option key={provider.id_provider} value={provider.id_provider}>
                                            {provider.nom}
                                        </option>
                                    ))}
                                </Field>
                            </div>

                            {values.id_provider && (
                                <FieldArray name="products">
                                    {({ push, remove }) => (
                                        <div className="space-y-4">
                                            <ButtonOrder
                                                buttonType="button"
                                            onClick={() => push({ id_product: "", quantité: 1 })}
                                            ButtonName="+ Ajouter un produit"/>

                                            {values.products.map((p, index) => (
                                                <div key={index} className="flex gap-4 items-end">
                                                    <div className="flex-1">
                                                        <label className="block mb-1">Produit</label>
                                                        <Field
                                                            as="select"
                                                            name={`products[${index}].id_product`}
                                                            className="w-full border rounded p-2"
                                                        >
                                                            <option value="">-- Choisir --</option>
                                                            {filteredProducts.map((product) => (
                                                                <option key={product.id_product} value={product.id_product}>
                                                                    {product.nom} ({product.prix_unitaire} €)
                                                                </option>
                                                            ))}
                                                        </Field>
                                                    </div>
                                                    <div>
                                                        <label className="block mb-1">Quantité</label>
                                                        <Field
                                                            type="number"
                                                            name={`products[${index}].quantité`}
                                                            min={1}
                                                            className="w-24 border rounded p-2"
                                                        />
                                                    </div>
                                                    <ButtonOrder
                                                        buttonType="button"
                                                        onClick={() => remove(index)}
                                                        ButtonName="✕"/>

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                            )}

                            <div className="text-xl font-semibold">Total estimé : {total.toFixed(2)} €</div>
                            <ButtonOrder
                                         buttonType="submit"
                                         ButtonName="Valider la commande"/>
                        </Form>
                    );
                }}
            </Formik>
        </div>
            ) : (
                <div>
                    <p>Chargement</p>
                </div>
            )}
            </>
    );
};

export default OrderCrud;
