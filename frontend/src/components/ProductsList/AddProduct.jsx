import {useEffect, useState} from "react";
import axios from "axios";
import {number} from "yup";

const AddProduct = () => {
    const [images, setImages] = useState([]);
    const [nom, setNom] = useState("");
    const [seuil, setSeuil] = useState(0);
    const [description, setDescription] = useState("");
    const [option, setOption] = useState("");
    const [category, setCategory] = useState([]);
    const [provider, setprovider] = useState([]);
    const [localisation, setLocalisation] = useState([]);
    const [providerOption, setproviderOption] = useState("");
    const [peremption, setPeremption] = useState("");
    const [productCode, setProductCode] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [conditionAchat, setConditionAchat] = useState("");
    const [dateAdded, setDateAdded] = useState(new Date());
    const [idAdmin, setIdAdmin] = useState(1);

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

    useEffect(() => {
        const getCategory = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`)
                setCategory(res.data);
            }
            catch (error) {
                console.log(error)
            }
        }
        getCategory();

        const getProvider = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`)
                setprovider(res.data);
            }
            catch (error) {
                console.log(error)
            }
        }
        getProvider();
    }, []);

    console.log(category)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const productData = {
                nom,
                description,
                prix_unitaire: price,
                quantité_en_stock: quantity,
                localisation,
                date_add: dateAdded,
                code_product: productCode,
                date_peremption: peremption,
                last_updated: new Date(),
                id_admin: idAdmin,
                image: null, // à compléter si tu gères l'image
                document: null,
                condition_achat: conditionAchat,
                seuil_minimal: seuil,
                id_provider: providerOption,
                id_category: option, // sera auto-renseignée via le backend
                created_at: new Date(),
                image_prev: null,
                image_prev_two: null,
            };


            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products`, productData, {
                headers: {
                    headers: { "Content-Type": "application/json" },
                },
            })
            if (response.status === 200 || response.status === 201) {
                alert("Produit ajouté !");
                // Réinitialiser form
                setNom("");
                setDescription("");
                setOption([]);
                setImages([]);
                setSeuil((number))
                setLocalisation("")
                setproviderOption("")
                setProductCode("")
                setQuantity((number))
                setPrice((number))
                setConditionAchat("")
            } else {
                alert("Erreur lors de l'ajout du produit.");
            }
        } catch(err) {
        console.log(err);
    }
    }

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

        return (
            <>
                <div className="flex justify-center">
                    <main className="flex flex-wrap gap-8">
                        <form className="w-full flex flex-wrap" onSubmit={handleSubmit}>
                            <div className="max-w-3xl p-6 bg-white rounded-2xl shadow">
                                <h1 className="text-2xl font-bold mb-4">Ajouter un produit</h1>

                                <div className="mb-4">
                                    <label htmlFor="nom" className="block font-medium">Nom du produit</label>
                                    <input type="text" id="nom"
                                           value={nom}
                                           onChange={(e)=> setNom(e.target.value)}
                                           className="input w-full border border-gray-300 rounded p-2" required/>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="seuil_minimal" className="block font-medium">Seuil minimum</label>
                                    <input type="number" id="seuil_minimal"
                                           value={seuil}
                                           onChange={(e)=> setSeuil(Number(e.target.value))}
                                           className="input w-full border border-gray-300 rounded p-2" required/>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="description" className="block font-medium">Description</label>
                                    <textarea id="description"
                                              value={description}
                                              onChange={(e)=> setDescription(e.target.value)}
                                              className="textarea w-full border border-gray-300 rounded p-2" required/>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="category" className="block font-medium">Catégorie</label>
                                    <select id="category" className="select w-full border border-gray-300 rounded p-2"
                                            onChange={(e) => setOption(e.target.value)} defaultValue="" required>
                                        <option value="" disabled>-- Sélectionnez une catégorie --</option>
                                        {category.map((categorie, index) => (
                                            <option key={index} value={categorie.id_category}>{categorie.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="provider" className="block font-medium">Fournisseur</label>
                                    <select id="provider" className="select w-full border border-gray-300 rounded p-2"
                                            onChange={(e) => setproviderOption(e.target.value)} defaultValue="" required>
                                        <option value="" disabled>-- Sélectionnez un fournisseur --</option>
                                        {provider.map((providerMap, index) => (
                                        <option key={index} value={providerMap.id_provider}>{providerMap.nom}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="localisation" className="block font-medium">Localisation</label>
                                    <input type="text" id="localisation"
                                           value={localisation}
                                           onChange={(e)=> setLocalisation(e.target.value)}
                                           className="input w-full border border-gray-300 rounded p-2" required/>
                                </div>
                            </div>

                            <div className="max-w-3xl p-6 bg-white rounded-2xl shadow">
                                <div className="mb-4">
                                    <label htmlFor="code_product" className="block font-medium">Code produit</label>
                                    <input type="text" id="code_product"
                                           className="input w-full border border-gray-300 rounded p-2"
                                           value={productCode}
                                           onChange={(e)=> setProductCode(e.target.value)}
                                    required/>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="quantité_en_stock" className="block font-medium">Quantité
                                        actuelle</label>
                                    <input type="number" id="quantité_en_stock"
                                           className="input w-full border border-gray-300 rounded p-2"
                                           value={quantity}
                                           onChange={(e)=> setQuantity(e.target.value)}
                                    required/>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="prix_unitaire" className="block font-medium">Prix unitaire</label>
                                    <input type="number" id="prix_unitaire"
                                           className="input w-full border border-gray-300 rounded p-2"
                                           value={price}
                                           onChange={(e)=> setPrice(e.target.value)}
                                    required/>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="date_peremption" className="block font-medium">Date de
                                        péremption</label>
                                    <input type="date" id="date_peremption"
                                           className="input w-full border border-gray-300 rounded p-2"
                                           value={peremption}
                                           onChange={(e)=> setPeremption(e.target.value)}/>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="condition_achat" className="block font-medium">Condition
                                        d'achat</label>
                                    <input type="text" id="condition_achat"
                                           className="input w-full border border-gray-300 rounded p-2"
                                           placeholder="Unité, Lot, Palette..."
                                           value={conditionAchat}
                                           onChange={(e)=> setConditionAchat(e.target.value)}
                                    required/>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="images" className="block mb-1 font-semibold">
                                        Images (1 à 3)
                                    </label>
                                    <input
                                        type="file"
                                        id="images"
                                        className="input"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                {images.length > 0 && (
                                    <div className="flex gap-4 mb-4">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt={`Aperçu ${index + 1}`}
                                                    className="w-24 h-24 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary mt-6"
                                    disabled={images.length === 0}
                                >
                                    Ajouter le produit
                                </button>

                        <div className="mt-6">
                            <button
                                className="btn btn-primary px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
                                Ajouter le produit
                            </button>
                        </div>
                </div>
                        </form>
            </main>
                </div>
            </>
        )
    }

    export default AddProduct;