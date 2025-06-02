import {useEffect, useState} from "react";
import axios from "axios";
import ButtonOrder from "@components/Button/ButtonOrder";
import {useNavigate} from "react-router-dom";

const StoreManageView = () => {
    const [products, setProducts] = useState([]);
    const [providers, setProviders] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [stores, setStores] = useState([]);
    const [connect, setConnect] = useState(false);
    console.log(providers)

    useEffect(() => {
        fetchProducts();
        fetchProvider();
        fetchCategory();
        fetchStores();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, {
                withCredentials: true,
            });
            setProducts(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement des produits :", error);
        }
    };

    const fetchProvider = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`, {
                withCredentials: true,
            });
            setProviders(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement des produits :", error);
        }
    };

    const fetchCategory = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {
                withCredentials: true,
            });
            setCategorys(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement des produits :", error);
        }
    };

    const fetchStores = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/store`, {
                withCredentials: true,
            });
            setStores(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement des produits :", error);
        }
    };


    const getProviderName = (providerId) => {
    const providerActif = providers.find((provider) => provider.id_provider === providerId);
    return providerActif ? providerActif.nom : providerId;
    }

    const getCategoryName = (categoryId) => {
        const categoryActif = categorys.find((category) => category.id_category === categoryId);
        return categoryActif ? categoryActif.nom : categoryId;
    }

    const getStoreName = (storeId) => {
        const storeActif = stores.find((store) => store.id_category === storeId);
        return storeActif ? storeActif.nom : storeId;
    }

    const totalProduits = products.length;
    const totalFournisseurs = providers.length;
    const totalCategories = categorys.length;
    const valeurTotaleStock = products.reduce((total, p) => {
        return total + (p.prix_unitaire * p.quantité_en_stock || 0);
    }, 0);

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
    }, []);

    return (
        <div className="p-8">
            {/* Présentation générale */}
            <section className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Bienvenue dans notre Boutique</h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                    Retrouvez ici une sélection de produits disponibles dans nos magasins, répartis par catégories et
                    fournisseurs.
                    Consultez les informations de stock, les prix, et accédez à la fiche détaillée de chaque article.
                </p>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white shadow rounded-xl p-4">
                    <p className="text-sm text-gray-500">Total produits</p>
                    <p className="text-xl font-bold">{totalProduits}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                    <p className="text-sm text-gray-500">Catégories</p>
                    <p className="text-xl font-bold">{totalCategories}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                    <p className="text-sm text-gray-500">Fournisseurs</p>
                    <p className="text-xl font-bold">{totalFournisseurs}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4">
                    <p className="text-sm text-gray-500">Valeur stock (€)</p>
                    <p className="text-xl font-bold text-green-600">{valeurTotaleStock.toFixed(2)}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.length < 10 && (
                    <>
                        {products.map((product) => (
                            <div
                                key={product.id_product}
                                className="bg-white rounded-2xl shadow hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
                            >
                                <img
                                    src={product.image || "/placeholder.jpg"}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 flex flex-col flex-1">
                                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                                    <p className="text-gray-700 text-sm mb-2 line-clamp-3">{product.description}</p>
                                    <div className="text-sm text-gray-500 mb-1">
                                        Catégorie : {getCategoryName(product.id_category)}
                                    </div>
                                    <div className="text-sm text-gray-500 mb-1">
                                        Fournisseur : {getProviderName(product.id_provider)}
                                    </div>
                                    <div className="text-sm text-gray-500 mb-1">
                                        Magasin : {getStoreName(product.id_store)}
                                    </div>
                                    <div className="text-sm text-gray-500 mb-2">
                                        Stock : {product.quantité_en_stock ?? "Inconnu"}
                                    </div>
                                    <div className="mt-auto gap-3 flex flex-col flex-wrap items-start">
                                        <p className="text-lg font-bold text-blue-600">{product.prix_unitaire} €</p>

                                        <ButtonOrder ButtonName="Voir le produit"
                                                     onClick={() => window.location.href = `/produit/${product.id_product}`}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};
export default StoreManageView