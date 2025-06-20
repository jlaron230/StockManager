import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from 'react-router-dom';
import InputEdit from "@components/Button/InputEdit";
import TextEdit from "@components/Button/TextEdit";
import ImageEffect from "@components/Button/ImageEffect";
import OptionCategory from "@components/Button/OptionCategory";
import OptionText from "@components/Button/OptionText";
import { BellIcon } from "@heroicons/react/24/outline";
import ButtonSupp from "@components/Button/ButtonSupp";
import ButtonReturn from "@components/Button/ButtonReturn";
import formatDate from "@services/FormatDate";
import ModalProduct from "@components/ProductsList/ModalProduct";

const ProductCrud = () => {
    let navigate = useNavigate(); // Hook pour naviguer programmétiquement
    const {id} = useParams(); // Récupère l'id du produit dans l'URL

    // États pour gestion des droits et données produit
    const [isAdmin, setIsAdmin] = useState(false);
    const [isConnect, setIsConnect] = useState(false);
    const [product, setProduct] = useState(null);
    const [provider, setProvider] = useState([]);
    const [category, setCategory] = useState(null);
    const [dateArray, setDateArray] = useState([]);
    const [loading, setLoading] = useState(false);

    // États pour gérer le mode édition sur différents champs
    const [editMode, setEditMode] = useState({
        threshold: false,
        description: false,
        category: false,
        quantityNow: false,
        maxPrice: false,
        SaleOption: false,
    });

    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // États pour les valeurs éditables
    const [value, setValue] = useState(10);
    const [QuantityNow, setQuantityNow] = useState(50);
    const [MaxPrice, setMaxPrice] = useState(10);
    const [desc, setDesc] = useState("");
    const [sale, setSale] = useState("");
    const [IsClicked, setIsClicked] = useState(true); // État pour contrôle de la modale

    // Validators pour vérifier la validité des valeurs modifiées avant envoi
    const validators = {
        threshold: (val) => typeof val === "number" && val > 0,
        description: (val) => val.trim().length >= 10,
        category: (val) => typeof val === "number" && val > 0,
        MaxPrice: (val) => typeof val === "number" && val > 0,
        SaleOption: (val) => val.trim().length >= 5,
    };

    // Vérifie la session et les droits utilisateur au chargement du composant
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // envoi du cookie
        })
            .then((res) => {
                if (!res.ok) {
                    setIsConnect(false);
                    // Si non connecté, redirige vers connexion
                    navigate("/connexion");
                } else {
                    setIsConnect(true);
                    return res.json();
                }
            })
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                }
                // Sinon accès à la page autorisé
            });
    }, []);

    // Fonction toggle pour ouvrir/fermer modale suppression
    const HandleClick = () => {
        setIsClicked(!IsClicked);
    }

    // Suppression du produit via API et redirection après suppression
    const HandleSupp = async (e) => {
        try {
            const productRes = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`, {
                withCredentials: true,
            });
            console.log(productRes);
            navigate('/produit');
        }catch(err) {
            console.log(err);
        }
    }

    // Chargement des données produit, fournisseur, catégories au chargement ou changement d'id
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`, {withCredentials: true});
                setProduct(productRes.data);
                setSelectedCategory(productRes.data.id_category);
                setValue(productRes.data.seuil_minimal);
                setDesc(productRes.data.description);
                setQuantityNow(productRes.data.quantité_en_stock);
                setMaxPrice(productRes.data.prix_unitaire);
                setSale(productRes.data.condition_achat);

                const providerRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`, {withCredentials: true});
                const foundProv = providerRes.data.find(prov => prov.id_provider === productRes.data.id_provider);
                setProvider(foundProv);

                // Formatte les dates pour affichage
                const formatArray = formatDate(productRes.data.date_add)
                const formatArrayPer = formatDate(productRes.data.date_peremption)
                const formatArrayCreated = formatDate(productRes.data.created_at)
                setDateArray([formatArray, formatArrayPer, formatArrayCreated]);

                console.log(productRes.data);

                const categoryRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {withCredentials: true});
                setCategoryList(categoryRes.data);
                const foundCat = categoryRes.data.find(cat => cat.id_category === productRes.data.id_category);
                setCategory(foundCat);

            } catch (error) {
                console.error("Erreur lors du chargement du produit :", error);
            }
        };

        fetchProduct();
    }, [id]);

    // Fonction qui envoie la modification d’un champ au backend via PUT
    const handlePut = async (field) => {
        try {
            const updatedData = { ...product };
            let newValue;

            switch (field) {
                case "threshold":
                    newValue = value;
                    if (!validators.threshold(newValue)) return alert("Valeur de seuil invalide");
                    updatedData.seuil_minimal = newValue;
                    break;
                case "description":
                    newValue = desc;
                    if (!validators.description(newValue)) return alert("Description invalide");
                    updatedData.description = newValue;
                    break;
                case "category":
                    newValue = selectedCategory;
                    if (!validators.category(newValue)) return alert("Catégorie invalide");
                    updatedData.id_category = newValue;
                    break;
                case "quantityNow":
                    newValue = QuantityNow;
                    updatedData.quantité_en_stock = newValue;
                    break;
                case "MaxPrice":
                    newValue = MaxPrice;
                    if (!validators.MaxPrice(newValue)) return alert("Prix invalide");
                    updatedData.prix_unitaire = newValue;
                    break;
                case "SaleOption":
                    newValue = sale;
                    if (!validators.SaleOption(newValue)) return alert("Condition d'achat invalide");
                    updatedData.condition_achat = newValue;
                    break;
                default:
                    return;
            }

            setLoading(true);
            const productPut = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`, updatedData, {
                withCredentials: true,
            });
            console.log(productPut.data);
        } catch (error) {
            console.error("Erreur lors de la modification du produit :", error);
        } finally {
            setLoading(false);
        }
    };

    // Active le mode édition pour un champ donné
    const handleEdit = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
    };

    // Désactive le mode édition pour un champ donné
    const handleValidate = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: false }));
    };

    // Affiche un chargement tant que le produit n'est pas récupéré
    if (!product) return <div>Chargement...</div>;

    // Prépare le tableau des images valides pour le composant ImageEffect
    const images = [
        product.image,
        product.image_prev,
        product.image_prev_two,
    ].filter(Boolean);

    return (
        <div className="flex justify-center">
            {isConnect && (
                <main className="flex flex-wrap m-8">
                    <div>
                        <div>
                            {/* Bouton retour à la liste produits */}
                            <Link to="/produit">
                                <ButtonReturn className="flex flex-wrap"/>
                            </Link>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="max-w-3xl mx-auto p-6">
                                <div>
                                    {/* Affiche la date de création formatée */}
                                    <p>Date de création :<span className="text-blue-500 font-bold"> {dateArray[2]}</span></p>
                                </div>

                                {/* Affiche les images du produit avec effets */}
                                <ImageEffect image={images} nom={product.nom}/>

                                {/* Zone alerte rupture stock (commentée) */}
                                {/* <div className="flex justify-center mt-6">
                            <p className="gap-1 flex items-center"><BellIcon className="size-10 text-color-picto" /> être alerter <a href="#" className="text-color">(produit en rupture de stock)</a></p>
                        </div> */}

                                <div className="mt-8 flex justify-center">
                                    {/* Bouton suppression visible uniquement pour admin */}
                                    {isAdmin ? (
                                        <>
                                            <ButtonSupp onClick={HandleClick} />
                                            {!IsClicked && (
                                                <ModalProduct
                                                    supp={HandleSupp}
                                                    setModalOpen={HandleClick}
                                                    modalOpen={IsClicked}
                                                    nameModal={`Supprimer le produit "${product.nom}"`}
                                                    descriptionModal={"Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible."}
                                                />
                                            )}
                                        </>
                                    ) : null}
                                </div>

                                <div className="mt-8 grid grid-cols-1 gap-4">
                                    {/* Nom du produit, en lecture seule */}
                                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{product.nom}</h2>

                                    {/* Description modifiable */}
                                    <TextEdit
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        onBlur={() => {
                                            handleValidate("description");
                                            handlePut("description");
                                        }}
                                        onClick={() => handleEdit("description")}
                                        isEdit={editMode.description}
                                        label="Description"
                                    />

                                    {/* Catégorie modifiable */}
                                    <OptionCategory
                                        list={categoryList}
                                        selected={selectedCategory}
                                        onChange={(e) => setSelectedCategory(Number(e.target.value))}
                                        onBlur={() => {
                                            handleValidate("category");
                                            handlePut("category");
                                        }}
                                        onClick={() => handleEdit("category")}
                                        isEdit={editMode.category}
                                    />

                                    {/* Seuil minimal modifiable */}
                                    <InputEdit
                                        value={value}
                                        onChange={(e) => setValue(Number(e.target.value))}
                                        onBlur={() => {
                                            handleValidate("threshold");
                                            handlePut("threshold");
                                        }}
                                        onClick={() => handleEdit("threshold")}
                                        isEdit={editMode.threshold}
                                        label="Seuil minimal"
                                    />

                                    {/* Quantité en stock modifiable */}
                                    <InputEdit
                                        value={QuantityNow}
                                        onChange={(e) => setQuantityNow(Number(e.target.value))}
                                        onBlur={() => {
                                            handleValidate("quantityNow");
                                            handlePut("quantityNow");
                                        }}
                                        onClick={() => handleEdit("quantityNow")}
                                        isEdit={editMode.quantityNow}
                                        label="Quantité en stock"
                                    />

                                    {/* Prix unitaire modifiable */}
                                    <InputEdit
                                        value={MaxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        onBlur={() => {
                                            handleValidate("MaxPrice");
                                            handlePut("MaxPrice");
                                        }}
                                        onClick={() => handleEdit("MaxPrice")}
                                        isEdit={editMode.MaxPrice}
                                        label="Prix unitaire"
                                    />

                                    {/* Condition d'achat modifiable */}
                                    <OptionText
                                        value={sale}
                                        onChange={(e) => setSale(e.target.value)}
                                        onBlur={() => {
                                            handleValidate("SaleOption");
                                            handlePut("SaleOption");
                                        }}
                                        onClick={() => handleEdit("SaleOption")}
                                        isEdit={editMode.SaleOption}
                                        label="Condition d'achat"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
};

export default ProductCrud;
