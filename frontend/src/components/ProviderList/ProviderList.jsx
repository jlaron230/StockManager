import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import ButtonAddProvider from "@components/Button/ButtonAddProvider";
import {GetProviderLocalisationFilter} from "@components/ProviderList/GetProviderLocalisationFilter";

const ProviderList = () => {
    let navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(true);
    const [isConnect, setIsConnect] = useState(true);
    const [providers, setProviders] = useState([])
    const [filteredProvider, setFilteredProvider] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('')

    const currentItems = filteredProvider.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProvider.length / itemsPerPage);

    const providerSave = (searchValue) => {
        setCurrentPage(1);
        if (searchValue.trim() !== "") {
            const filtered = providers.filter((provider) =>
                provider.type.toLowerCase().includes(searchValue.toLowerCase())
            )
            setFilteredProvider(filtered);
            } else {
            // Si la recherche est vide, on remet tous les produits
            setFilteredProvider(providers);
        }
    }

    const providerLocalisation = (searchValue) => {
        setCurrentPage(1);
        const filtered = GetProviderLocalisationFilter(providers, searchValue)
        setFilteredProvider(filtered);
    }


    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // important pour envoyer le cookie
        })
            .then((res) => {
                if (!res.ok) {
                    setIsConnect(false);
                    navigate("/connexion")
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
        setFilteredProvider(providers);
    }, [providers]);

    useEffect(() => {
        const FetchProviderData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`, {withCredentials: true});
                console.log(response)
                setProviders(response.data);
                setFilteredProvider(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setError("Failed to fetch product data");
            }
        }
        FetchProviderData();

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
                setFilteredProvider(providers)
            } else {
                const results = providers.filter((product) =>
                    product.nom.toLowerCase().includes(term.toLowerCase()),
                )
                setFilteredProvider(results);
            }
        }, 300),
        [providers],
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
                    {/* Fournisseurs + Recherche */}
                    <main className=" space-y-6">
                        <div className="flex justify-center items-end gap-5 max-md:flex-wrap">
                            {/* Recherche */}
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
                            {/* Type */}
                            <div>
                                <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Type</h3>
                                <select id="typeProvidersFilter" onChange={(e) => providerSave(e.target.value)}
                                        className="w-full p-2 border rounded-md text-sm" defaultValue="">
                                    <option value="" disabled>-- Sélectionnez un type --</option>
                                    {[...new Set(providers.map((type) => type.type))].map((type, index) => (
                                        <option value={type} key={index}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Type localisation */}
                            <div>
                                <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Localisation</h3>
                                <select id="typeProviderFilter" onChange={(e) => providerLocalisation(e.target.value)}
                                        className="w-full p-2 border rounded-md text-sm" defaultValue="">
                                    <option value="" disabled>-- Sélectionnez une localisation --</option>
                                    {[...new Set(providers.map((type) => type.code_postal))].map((type, index) => (
                                        <option value={type} key={index}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Liste providers */}
                        {currentItems.length > 0 ? (
                            <div className="space-y-4 flex flex-col items-center justify-center">
                                {
                                    currentItems.map((provider, index) => {
                                        return (
                                            <ProviderFiche
                                                key={index}
                                                providerName={provider.nom}
                                                providerDesc={provider.commentaire}
                                                providerImage={provider.image}
                                                providerId={provider.id_provider}
                                                providerType={provider ? provider.type : "Non renseigné"}
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
                                    <Link to="/ajout-provider">
                                        <ButtonAddProvider />
                                    </Link>
                                </div>
                            ) : (
                                <></>
                            )}
                            <div>
                                <button
                                    aria-label="Bouton de pagination a gauche"
                                    className="px-3 py-1 border rounded hover:bg-gray-200"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                >
                                    {"<"}
                                </button>
                                {Array.from({length: totalPages}, (_, i) => i + 1).map(
                                    (page) => (
                                        <button
                                            aria-label="Bouton de numéro de page"
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
                                    aria-label="Bouton de pagination a droite"
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

const ProviderFiche = ({providerName, providerImage, providerDesc, providerType, providerId }) => {
    return (
        <>
            {/* Liste fournisseurs */}
            <div className="justify-center space-y-4 md:w-125 flex flex-wrap gap-2">
                <div className="flex items-center md:w-90 max-md:full p-4 bg-white rounded-lg shadow-md">
                    <div className="ml-4 flex-1">
                        <h4 className="text-lg font-bold">{providerName}</h4>
                        <p className="text-gray-500 text-sm">
                            {providerDesc}
                        </p>
                        <p className="text-gray-400 text-xs italic">Type : {providerType}</p>
                        <Link to={`/fournisseur/${providerId}`}>
                            <button
                                aria-label="Bouton voir le fournisseur"
                                className="mt-2 Primary-Color bg-blue-700 text-white text-sm px-3 py-1 rounded">
                                voir fournisseur
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProviderList;