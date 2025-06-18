import {useCallback, useEffect, useState} from "react";
import Product from "@pages/Product";
import {date} from "yup";
import product from "@pages/Product";
import axios from "axios";
import {set} from "husky";
import {Link, useNavigate} from "react-router-dom";
import ButtonAddProduct from "@components/Button/ButtonAddProduct";
import {getFilteredProducts} from "@components/ProductsList/getFilteredProducts";
import {GetFilteredDate} from "@components/ProductsList/GetFilteredDate";

const ProductList = () => {
    let navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isConnect, setIsConnect] = useState(false);
    const [products, setProducts] = useState([])
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [filteredDate, setfilteredDate] = useState(true);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('')

    const currentItems = filteredProduct.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProduct.length / itemsPerPage);
    const typesCategorie = [...new Set(categories.map(c => c.nom))];

    const productSave = (searchValue) => {
        setCurrentPage(1);
        if (searchValue.trim() !== "") {
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

        const filterDate = () => {
            const newFilteredDate = !filteredDate;
            setfilteredDate(newFilteredDate);
            const sorted = GetFilteredDate(products, filteredDate);
            setFilteredProduct(sorted);
            setCurrentPage(1);
        }

    const filteredPrice = (minpriceValue, maxpriceValue) => {
        const filtered = getFilteredProducts(products, minpriceValue, maxpriceValue);
        setFilteredProduct(filtered);
        setCurrentPage(1);
    };


    useEffect(() => {
        setFilteredProduct(products);
    }, [products]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // important pour envoyer le cookie
        })
            .then((res) => {
                if (!res.ok) {
                    navigate("/connexion");
                    setIsConnect(false);
                    // Si non connecté, on redirige vers l'accueil
                } else {
                    setIsConnect(true);
                    return res.json();
                }
            })
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    // Si connecté mais pas admin, on redirige aussi
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                }
                // Sinon, laisser l'accès à la page
            })
    }, []);

    useEffect(() => {
        //si l'utilisateur est connecté
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

        const FetchCategory = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`, {withCredentials: true})
            setCategories(response.data);
        }
        FetchCategory();

    }, []);

    const debounce  = (func, delay) => {
        let timeoutId
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args, delay);
            })
        }
    }

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

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
        console.log(searchTerm)
    }

    return (
        <>
            {isConnect && (
        <section className="flex justify-center items-start py-10">
            <div className="gap-8 flex flex-wrap justify-center mx-auto max-w-screen-xl m-5">
                {/* Filtres */}
                <aside className="w-64 bg-white p-4 rounded-lg space-y-6">
                    {/* Prix */}
                    <div>
                        <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Prix</h3>
                        <div className="flex gap-2">
                            <input onChange={(e) => {
                                const value = e.target.value;
                                setMinPrice(value);
                                filteredPrice(Number(value), Number(maxPrice));
                                filteredPrice(Number(minPrice), Number(value));
                            }} type="number" placeholder="minimum"
                                   className="w-full p-2 border rounded-md text-sm"/>

                            <input onChange={(e) =>{const value = e.target.value;
                                setMaxPrice(value);
                                filteredPrice(Number(minPrice), Number(value))}} type="number" placeholder="maximum"
                                   className="w-full p-2 border rounded-md text-sm"/>
                        </div>
                    </div>

                    {/* Type */}
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

                    {/* Ajouté récemment */}
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

                {/* Produits + Recherche */}
                <main className=" space-y-6">
                    {/* Recherche */}
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

                    {/* Liste produits */}
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
                        <button
                            className="px-3 py-1 border rounded hover:bg-gray-200"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            {"<"}
                        </button>
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

const ProductFiche = ({productName, productImage, productDesc, productCategory, productId }) => {
    return (
        <>
            {/* Liste produits */}
            <div className="justify-center space-y-4 md:w-125 flex flex-wrap gap-2">
                <div className="flex items-center md:w-110 max-md:full p-4 bg-white rounded-lg shadow-md">
                    <img
                        src={productImage}
                        alt="Produit"
                        className="w-40 h-40 object-contain rounded"
                    />
                    <div className="ml-4 flex-1">
                        <h4 className="text-lg font-bold">{productName}</h4>
                        <p className="text-gray-500 text-sm">
                            {productDesc}
                        </p>
                        <p className="text-gray-400 text-xs italic">Catégorie : {productCategory}</p>
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