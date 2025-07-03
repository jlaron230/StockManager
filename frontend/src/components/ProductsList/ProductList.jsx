import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import ButtonAddProduct from "@components/Button/ButtonAddProduct";
import {getFilteredProducts} from "@components/ProductsList/getFilteredProducts";
import {GetFilteredDate} from "@components/ProductsList/GetFilteredDate";

const ProductList = () => {
    let navigate = useNavigate(); // Hook pour la navigation programmatique
    const [isAdmin, setIsAdmin] = useState(false); // État pour savoir si l'utilisateur est admin
    const [isConnect, setIsConnect] = useState(false); // État pour savoir si l'utilisateur est connecté
    const [products, setProducts] = useState([]) // Liste complète des produits
    const [filteredProduct, setFilteredProduct] = useState([]); // Liste des produits filtrés à afficher
    const [filteredDate, setfilteredDate] = useState(true); // Filtre par date (ajouté récemment)
    const [minPrice, setMinPrice] = useState(""); // Prix minimum filtré
    const [maxPrice, setMaxPrice] = useState(""); // Prix maximum filtré
    const [currentPage, setCurrentPage] = useState(1); // Page courante pour la pagination
    const itemsPerPage = 5; // Nombre d'items par page
    const [error, setError] = useState(null); // Gestion des erreurs pour les appels API
    const [categories, setCategories] = useState([]); // Liste des catégories produits
    const [searchTerm, setSearchTerm] = useState('') // Terme de recherche pour filtre texte

    // Calcul des produits à afficher sur la page courante (pagination)
    const currentItems = filteredProduct.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Nombre total de pages pour la pagination
    const totalPages = Math.ceil(filteredProduct.length / itemsPerPage);

    // Extraction des types uniques de catégories (nom)
    const typesCategorie = [...new Set(categories.map(c => c.nom))];

    // Fonction qui filtre les produits par catégorie choisie dans le select
    const productSave = (searchValue) => {
        setCurrentPage(1); // On revient à la page 1 après filtre
        if (searchValue.trim() !== "") {
            // On filtre les produits dont la catégorie correspond à la recherche
            const filtered = products.filter(product => {
                const category = categories.find(cat => cat.id_category === product.id_category);
                return category && category.nom.toLowerCase() === searchValue.toLowerCase();
            });
            setFilteredProduct(filtered);
            console.log(filtered);
        } else {
            // Si la recherche est vide, on remet tous les produits
            setFilteredProduct(products);
        }
    }

    // Fonction qui inverse le filtre par date (ajout récent) et trie les produits en conséquence
    const filterDate = () => {
        const newFilteredDate = !filteredDate;
        setfilteredDate(newFilteredDate);
        const sorted = GetFilteredDate(products, filteredDate);
        setFilteredProduct(sorted);
        setCurrentPage(1);
    }

    // Filtre par prix minimum et maximum
    const filteredPrice = (minpriceValue, maxpriceValue) => {
        const filtered = getFilteredProducts(products, minpriceValue, maxpriceValue);
        setFilteredProduct(filtered);
        setCurrentPage(1);
    };

    // Synchronise la liste filtrée dès que la liste complète de produits change
    useEffect(() => {
        setFilteredProduct(products);
    }, [products]);

    // Vérifie si l'utilisateur est connecté et admin, sinon redirige vers la page de connexion
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // important pour envoyer le cookie de session
        })
            .then((res) => {
                if (!res.ok) {
                    navigate("/connexion"); // redirection si non connecté
                    setIsConnect(false);
                } else {
                    setIsConnect(true);
                    return res.json();
                }
            })
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    setIsAdmin(false); // pas admin = pas accès
                } else {
                    setIsAdmin(true); // accès admin
                }
            })
    }, []);

    // Charge les produits et catégories depuis l'API au montage du composant
    useEffect(() => {
        // Fonction async pour récupérer les produits
        const FetchProductData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, {
                    withCredentials: true,
                })
                console.log(response)
                setProducts(response.data);
                setFilteredProduct(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setError("Failed to fetch product data");
            }
        }
        FetchProductData();

        // Fonction async pour récupérer les catégories
        const FetchCategory = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {withCredentials: true})
            setCategories(response.data);
        }
        FetchCategory();

    }, []);

    // Fonction debounce pour limiter la fréquence d'appel à la recherche
    const debounce  = (func, delay) => {
        let timeoutId
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args, delay);
            })
        }
    }

    // Fonction de recherche avec debounce (optimisation performance)
    const handleSearch = useCallback(
        debounce ((term) => {
            if (term.trim() === "") {
                setFilteredProduct(products)
            } else {
                const results = products.filter((product) =>
                    product.nom.toLowerCase().includes(term.toLowerCase()),
                )
                setFilteredProduct(results);
            }
        }, 300),
        [products],
    )

    // Gère la saisie dans l'input de recherche
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value); // Met à jour le terme recherché
        handleSearch(value); // Lance la recherche filtrée
        console.log(searchTerm)
    }

    return (
        <>
            {isConnect && (
                <section className="flex justify-center items-start py-10">
                    <div className="gap-8 flex flex-wrap justify-center mx-auto max-w-screen-xl m-5">
                        {/* Filtres */}
                        <aside className="w-64 bg-white p-4 rounded-lg space-y-6">
                            {/* Filtre Prix */}
                            <div>
                                <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Prix</h3>
                                <div className="flex gap-2">
                                    {/* Prix minimum */}
                                    <input onChange={(e) => {
                                        const value = e.target.value;
                                        setMinPrice(value);
                                        filteredPrice(Number(value), Number(maxPrice));
                                        filteredPrice(Number(minPrice), Number(value));
                                    }} type="number" placeholder="minimum"
                                           className="w-full p-2 border rounded-md text-sm"/>

                                    {/* Prix maximum */}
                                    <input onChange={(e) =>{const value = e.target.value;
                                        setMaxPrice(value);
                                        filteredPrice(Number(minPrice), Number(value))}} type="number" placeholder="maximum"
                                           className="w-full p-2 border rounded-md text-sm"/>
                                </div>
                            </div>

                            {/* Filtre Type / Catégorie */}
                            <div>
                                <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Type</h3>
                                <select id="typeCategorieFilter" onChange={(e) => productSave(e.target.value)}
                                        className="w-full p-2 border rounded-md text-sm" defaultValue="">
                                    <option value="" disabled>-- Sélectionnez un produit --</option>
                                    {typesCategorie.map((type, index) => (
                                        <option value={type} key={index}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtre "Ajouté récemment" */}
                            <div className="gap-2 flex items-center justify-between flex-wrap flex-row">
                        <span
                            className="basis-52 text-gray-700 dark:text-gray-300 font-semibold">Ajouté récemment</span>
                                <label className="basis-52 relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" onChange={filterDate} className="sr-only peer"/>
                                    <div
                                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600"></div>
                                    <div
                                        className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></div>
                                </label>
                            </div>
                        </aside>

                        {/* Section principale produits + barre de recherche */}
                        <main className=" space-y-6">
                            {/* Barre de recherche */}
                            <div className="flex justify-center">
                                <div className="relative w-1/2">
                                    <input
                                        type="text"
                                        placeholder="Recherche"
                                        className="w-full border rounded-full py-2 px-4 pr-10 text-sm"
                                        onChange={handleInputChange}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {/* Affichage des produits filtrés */}
                            {currentItems.length > 0 ? (
                                <div className="space-y-4">
                                    {
                                        currentItems.map((product, index) => {
                                            const category = categories.find(cat => cat.id_category === product.id_category);
                                            return (
                                                <ProductFiche
                                                    key={index}
                                                    productName={product.nom}
                                                    productDesc={product.description}
                                                    productImage={product.image}
                                                    productCategory={category ? category.nom : "Non renseigné"}
                                                    productId={product.id_product}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p>Aucun produit trouvé.</p>
                                </div>
                            )}

                            {/* Pagination */}
                            <div className="flex justify-center space-x-1 mt-4 flex-wrap flex-col items-center gap-8">
                                {/* Bouton ajout produit visible uniquement pour admin */}
                                {isAdmin ? (
                                    <div>
                                        <Link to="/ajout-produit">
                                            <ButtonAddProduct />
                                        </Link>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <div>
                                    {/* Bouton page précédente */}
                                    <button
                                        className="px-3 py-1 border rounded hover:bg-gray-200"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                    >
                                        {"<"}
                                    </button>
                                    {/* Boutons de pages */}
                                    {Array.from({length: totalPages}, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 border rounded hover:bg-gray-200 ${
                                                    page === currentPage
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-200"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                    {/* Bouton page suivante */}
                                    <button
                                        className="px-3 py-1 border rounded hover:bg-gray-200"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                    >
                                        {">"}
                                    </button>
                                </div>

                            </div>
                        </main>
                    </div>
                </section>
            )}
        </>
    )
}

// Composant d'affichage d'une fiche produit individuelle
const ProductFiche = ({productName, productImage, productDesc, productCategory, productId }) => {
    return (
        <>
            {/* Container fiche produit */}
            <div className="justify-center space-y-4 md:w-125 flex flex-wrap gap-2">
                <div className="flex items-center md:w-110 max-md:full p-4 bg-white rounded-lg shadow-md">
                    {/* Image du produit */}
                    <img
                        src={productImage}
                        alt="Produit"
                        className="w-40 h-40 object-contain rounded"
                    />
                    <div className="ml-4 flex-1">
                        {/* Nom du produit */}
                        <h4 className="text-lg font-bold">{productName}</h4>
                        {/* Description courte */}
                        <p className="text-gray-500 text-sm">
                            {productDesc}
                        </p>
                        {/* Catégorie affichée */}
                        <p className="text-gray-400 text-xs italic">Catégorie : {productCategory}</p>
                        {/* Bouton pour voir le détail du produit */}
                        <Link to={`/produit/${productId}`}>
                            <button className="mt-2 Primary-Color bg-blue-700 text-white text-sm px-3 py-1 rounded">
                                voir produit
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductList
