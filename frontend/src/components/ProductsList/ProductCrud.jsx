import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useParams} from 'react-router-dom';
import InputEdit from "@components/Button/InputEdit";
import TextEdit from "@components/Button/TextEdit";
import ImageEffect from "@components/Button/ImageEffect";
import OptionCategory from "@components/Button/OptionCategory";
import OptionText from "@components/Button/OptionText";
import { BellIcon } from "@heroicons/react/24/outline";
import ButtonSupp from "@components/Button/ButtonSupp";
import ButtonReturn from "@components/Button/ButtonReturn";
import formatDate from "@services/FormatDate";

const ProductCrud = () => {
    const {id} = useParams();
    const [isAdmin, setIsAdmin] = useState(true);
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

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`);
                setProduct(productRes.data);
                setSelectedCategory(productRes.data.id_category);
                setValue(productRes.data.seuil_minimal);
                setDesc(productRes.data.description);
                setQuantityNow(productRes.data.quantité_en_stock);
                setMaxPrice(productRes.data.prix_unitaire);
                setSale(productRes.data.condition_achat);

                const providerRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`);
                const foundProv = providerRes.data.find(prov => prov.id_provider === productRes.data.id_provider);
                setProvider(foundProv);

                const formatArray = formatDate(productRes.data.date_add)
                const formatArrayPer = formatDate(productRes.data.date_peremption)
                const formatArrayCreated = formatDate(productRes.data.created_at)
                setDateArray([formatArray, formatArrayPer, formatArrayCreated]);

                console.log(productRes.data)
                const categoryRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`);
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
            const productPut = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/products/${id}`, updatedData)

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
            <aside className="max-w-3xl p-6">
                <Link to="/produit">
                    <ButtonReturn className="flex flex-wrap"/>
                </Link>
                <div>
                    <p>Date de création :<span> {dateArray[2]}</span></p>
                </div>
                <ImageEffect image={images} nom={product.nom}/>
            </aside>
            <main className="flex flex-wrap">
                <div className="max-w-3xl mx-auto p-6">
                    <h1 className="text-2xl font-bold">{product.nom}</h1>
                    <div>
                        <p>Seuil minimum</p>

                        {isAdmin ? (
                            <>
                                <InputEdit
                                    type="number"
                                    value={value}
                                    isEditing={editMode.threshold}
                                    onClick={() => handleEdit("threshold")}
                                    onChange={(e) => setValue(Number(e.target.value))}
                                    onValidate={() => {
                                        handlePut("threshold");
                                        handleValidate("threshold");
                                    }}
                                />
                            </>
                        ) : (
                            <span>{value}</span>
                        )}
                        <div>
                            <p>Date d'ajout au stock :<span> {dateArray[0]}</span></p>
                        </div>
                        <div>
                            <p>Description</p>
                            {isAdmin ? (
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
                            ) : (
                                <span>{desc}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="gap-1 flex items-center"><BellIcon className="size-10 text-color-picto" /> être alerter <a href="#" className="text-color">(produit en rupture de stock)</a></p>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto p-6">
                    <div>
                        <p>Catégorie</p>
                        {isAdmin ? (
                            <>
                                <OptionCategory value={selectedCategory}
                                                isEditing={editMode.category}
                                                options={categoryList}
                                                onClick={() => handleEdit("category")}
                                                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                                                onValidate={() => {
                                                    handlePut("category");
                                                    handleValidate("category");
                                                }}/>
                            </>
                        ) : (
                            <span>{category?.nom}</span>
                        )}
                    </div>
                    <div>
                        <p>Fournisseur</p>
                        <p>{provider.nom}</p>
                    </div>
                    <div>
                        <p>Localisation</p>
                        <p>{product.localisation}</p>
                    </div>
                </div>
                <div className="max-w-3xl mx-auto p-6">
                    <div>
                        <p>Code produit</p>
                        <p>{product.code_product}</p>
                    </div>
                    <div>
                        <p>Quantité actuelle</p>
                        {isAdmin ? (
                            <>
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
                            </>
                        ) : (
                            <span>{QuantityNow}</span>
                        )}
                    </div>
                    <div>
                        <p>Prix unitaire</p>
                        {isAdmin ? (
                            <>
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
                            </>
                        ) : (
                            <span>{MaxPrice} €</span>
                        )}
                    </div>
                    <div>
                        <p>Date de péremption</p>
                        <p>{dateArray[1]}</p>
                    </div>
                    <div>
                        <p>Condition d'achat</p>
                        {isAdmin ? (
                            <>
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
                            </>
                        ) : (
                            <span>{sale}</span>
                        )}
                    </div>

                </div>
                {isAdmin ? (
                <div className="max-w-3xl p-6">
                    <ButtonSupp />
                </div>
                    ) : (
                        <></>
                    )}
            </main>
        </div>
    );
};

export default ProductCrud;