import {useEffect, useState} from "react";
import axios from "axios";
import {Link, redirect, useNavigate, useParams} from 'react-router-dom';
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
    let navigate = useNavigate();
    const {id} = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isConnect, setIsConnect] = useState(false);
    const [product, setProduct] = useState(null);
    const [provider, setProvider] = useState([]);
    const [category, setCategory] = useState(null);
    const [dateArray, setDateArray] = useState([]);
    const [loading, setLoading] = useState(false);
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
    const [value, setValue] = useState(10);
    const [QuantityNow, setQuantityNow] = useState(50);
    const [MaxPrice, setMaxPrice] = useState(10);
    const [desc, setDesc] = useState("");
    const [sale, setSale] = useState("");
    const [IsClicked, setIsClicked] = useState(true);


    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // important pour envoyer le cookie
        })
            .then((res) => {
                if (!res.ok) {
                    setIsConnect(false);
                    // Si non connecté, on redirige vers la page de connexion
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
                // Sinon, laisser l'accès à la page
            })
    }, []);

    const HandleClick = () => {
        setIsClicked(!IsClicked);
    }

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

                const formatArray = formatDate(productRes.data.date_add)
                const formatArrayPer = formatDate(productRes.data.date_peremption)
                const formatArrayCreated = formatDate(productRes.data.created_at)
                setDateArray([formatArray, formatArrayPer, formatArrayCreated]);

                console.log(productRes.data)
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

    const handlePut = async (field) => {
        try {
            setLoading(true);
            const updatedData = {...product};

            switch (field) {
                case "threshold":
                    updatedData.seuil_minimal = value;
                    break;
                case "description":
                    updatedData.description = desc;
                    break;
                case "category":
                    updatedData.id_category = selectedCategory;
                    break;
                case "quantityNow":
                    updatedData.quantité_en_stock = QuantityNow;
                    break;
                case "MaxPrice":
                    updatedData.prix_unitaire = MaxPrice;
                    break;
                case "SaleOption":
                    updatedData.condition_achat = sale;
                    break;
                default:
                    setLoading(false);
                    return;
            }
            const productPut = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`, updatedData, {
                withCredentials: true,
            })

            console.log(productPut.data);
        } catch (error) {
        console.error("Erreur lors de la modification du produit :", error);
    } finally {
            setLoading(false);
        }
    }

    const handleEdit = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
    };

    const handleValidate = (field) => {
        setEditMode((prev) => ({ ...prev, [field]: false }));
    };

    if (!product) return <div>Chargement...</div>;

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
                    <Link to="/produit">
                        <ButtonReturn className="flex flex-wrap"/>
                    </Link>
                </div>
                <div className="flex flex-wrap">
                    <div className="max-w-3xl mx-auto p-6">
                        <div>
                            <p>Date de création :<span className="text-blue-500 font-bold"> {dateArray[2]}</span></p>
                        </div>
                        <ImageEffect image={images} nom={product.nom}/>
                        <div className="flex justify-center mt-6">
                            <p className="gap-1 flex items-center"><BellIcon className="size-10 text-color-picto" /> être alerter <a href="#" className="text-color">(produit en rupture de stock)</a></p>
                        </div>
                        <div className="mt-8 flex justify-center">
                            {isAdmin ? (
                                <>
                            <ButtonSupp NameSupp="Supprimer le produit" onClick={HandleClick}/>
                                </>
                                ) : (
                                <></>
                            )}
                        </div>
                    </div>
                <div className="max-w-3xl mx-auto p-6 flex flex-col gap-2.5">
                    <h1 className="text-2xl font-bold">{product.nom}</h1>
                    <div className="">
                        <p className="text-base">Seuil minimum</p>
                        {isAdmin ? (
                            <div className="flex gap-2">
                            <>
                                <InputEdit
                                    type="number"
                                    value={value ?? ""}
                                    isEditing={editMode.threshold}
                                    onClick={() => handleEdit("threshold")}
                                    onChange={(e) => setValue(Number(e.target.value))}
                                    onValidate={() => {
                                        handlePut("threshold");
                                        handleValidate("threshold");
                                    }}
                                />
                            </>
                            </div>
                        ) : (
                            <span className="text-blue-500 font-bold">{value}</span>
                        )}
                    </div>
                        <div>
                            <p className="text-base">Date d'ajout au stock</p>
                            <span className="text-blue-500 font-bold"> {dateArray[0]}</span>
                        </div>
                        <div>
                            <p className="text-base">Description</p>
                            {isAdmin ? (
                                <div className="flex gap-2 items-start">
                                <>
                                    <TextEdit type="text"
                                              value={desc}
                                              isEditing={editMode.description}
                                              onClick={() => handleEdit("description")}
                                              onChange={(e) => setDesc(e.target.value)}
                                              onValidate={() => {
                                                  handlePut("description");
                                                  handleValidate("description");
                                              }}/>
                                </>
                                </div>
                            ) : (
                                <div className="text-blue-500 font-bold whitespace-pre-line break-words max-w-full">
                                    {desc}
                                </div>
                            )}
                        </div>
                    <div>
                        <p className="text-base">Catégorie</p>
                        {isAdmin ? (
                                <div className="flex items-center gap-2">
                                <OptionCategory value={selectedCategory}
                                                isEditing={editMode.category}
                                                options={categoryList}
                                                onClick={() => handleEdit("category")}
                                                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                                                onValidate={() => {
                                                    handlePut("category");
                                                    handleValidate("category");
                                                }}/>
                                </div>
                        ) : (
                            <span className="text-blue-500 font-bold">{category?.nom}</span>
                        )}
                    </div>
                    <div>
                        <p className="text-base">Fournisseur</p>
                        <p className="text-blue-500 font-bold">{provider.nom}</p>
                    </div>
                    <div>
                        <p className="text-base">Localisation</p>
                        <p className="text-blue-500 font-bold">{product.localisation}</p>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto p-6 flex flex-col gap-2.5 mt-10.5">
                    <div>
                        <p className="text-base">Code produit</p>
                        <p className="text-blue-500 font-bold">{product.code_product}</p>
                    </div>
                    <div>
                        <p className="text-base">Quantité actuelle</p>
                        {isAdmin ? (
                            <div className="flex gap-2">
                                <InputEdit
                                    type="number"
                                    value={QuantityNow}
                                    isEditing={editMode.quantityNow}
                                    onClick={() => handleEdit("quantityNow")}
                                    onChange={(e) => setQuantityNow(Number(e.target.value))}
                                    onValidate={() => {
                                        handlePut("quantityNow");
                                        handleValidate("quantityNow");
                                    }}
                                />
                            </div>
                        ) : (
                            <span className="text-blue-500 font-bold">{QuantityNow}</span>
                        )}
                    </div>
                    <div>
                        <p className="text-base">Prix unitaire</p>
                        {isAdmin ? (
                            <div className="flex gap-2">
                                <InputEdit
                                    type="number"
                                    value={MaxPrice}
                                    isEditing={editMode.MaxPrice}
                                    onClick={() => handleEdit("MaxPrice")}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    onValidate={() => {
                                        handlePut("MaxPrice");
                                        handleValidate("MaxPrice");
                                    }}
                                />
                                {!editMode.MaxPrice && <span>€</span>}
                            </div>
                        ) : (
                            <span className="text-blue-500 font-bold">{MaxPrice} €</span>
                        )}
                    </div>
                    <div>
                        <p className="text-base">Date de péremption</p>
                        <p className="text-blue-500 font-bold">{dateArray[1]}</p>
                    </div>
                    <div>
                        <p className="text-base">Condition d'achat</p>
                        {isAdmin ? (
                            <div className="flex gap-2">
                                <OptionText
                                    type="text"
                                    value={sale}
                                    isEditing={editMode.SaleOption}
                                    onClick={() => handleEdit("SaleOption")}
                                    onChange={(e) => setSale(e.target.value)}
                                    onValidate={() => {
                                        handlePut("SaleOption");
                                        handleValidate("SaleOption");
                                    }}
                                />
                            </div>
                        ) : (
                            <span className="text-blue-500 font-bold">{sale}</span>
                        )}
                    </div>
                </div>
                {isAdmin && !IsClicked ? (
                    <>
                        <div>
                            <ModalProduct nameModal="Supprimer le produit" descriptionModal="Êtes-vous sûr de vouloir supprimer le produit ?" supp={HandleSupp} modalOpen={IsClicked} setModalOpen={setIsClicked} />
                        </div>
                    </>
                ) : (
                    <></>
                )}
                </div>
                </div>
            </main>
            )}
        </div>
    );
};

export default ProductCrud;