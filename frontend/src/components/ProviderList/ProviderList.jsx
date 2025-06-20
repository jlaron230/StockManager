import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import ButtonAddProvider from "@components/Button/ButtonAddProvider";
import {GetProviderLocalisationFilter} from "@components/ProviderList/GetProviderLocalisationFilter";

// Composant principal pour afficher la liste des fournisseurs
const ProviderList = () => {
    let navigate = useNavigate();

    // États de contrôle d'accès
    const [isAdmin, setIsAdmin] = useState(true);
    const [isConnect, setIsConnect] = useState(true);

    // États de données
    const [providers, setProviders] = useState([]);
    const [filteredProvider, setFilteredProvider] = useState([]);

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Autres états
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Définition des éléments à afficher sur la page actuelle
    const currentItems = filteredProvider.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProvider.length / itemsPerPage);

    // Filtrage par type de fournisseur
    const providerSave = (searchValue) => {
        setCurrentPage(1);
        if (searchValue.trim() !== "") {
            const filtered = providers.filter((provider) =>
                provider.type.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredProvider(filtered);
        } else {
            setFilteredProvider(providers);
        }
    };

    // Filtrage par localisation du fournisseur
    const providerLocalisation = (searchValue) => {
        setCurrentPage(1);
        const filtered = GetProviderLocalisationFilter(providers, searchValue);
        setFilteredProvider(filtered);
    };

    // Vérification de la session utilisateur et de son rôle
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include", // envoie le cookie de session
        })
            .then((res) => {
                if (!res.ok) {
                    setIsConnect(false);
                    navigate("/connexion"); // redirection si non connecté
                } else {
                    setIsConnect(true);
                    return res.json();
                }
            })
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    setIsAdmin(false); // utilisateur connecté mais non admin
                } else {
                    setIsAdmin(true);
                }
            });
    }, []);

    // Met à jour les fournisseurs filtrés quand les données changent
    useEffect(() => {
        setFilteredProvider(providers);
    }, [providers]);

    // Récupère les données des fournisseurs depuis le backend
    useEffect(() => {
        const FetchProviderData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/providers`, {withCredentials: true});
                console.log(response);
                setProviders(response.data);
                setFilteredProvider(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching product data:", error);
                setError("Failed to fetch product data");
            }
        };
        FetchProviderData();
    }, []);

    // Fonction de debounce pour la recherche
    const debounce  = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args, delay);
            });
        };
    };

    // Fonction de recherche (nom du fournisseur)
    const handleSearch = useCallback(
        debounce((term) => {
            if (term.trim() === "") {
                setFilteredProvider(providers);
            } else {
                const results = providers.filter((product) =>
                    product.nom.toLowerCase().includes(term.toLowerCase()),
                );
                setFilteredProvider(results);
            }
        }, 300),
        [providers],
    );

    // Gère la saisie utilisateur dans le champ de recherche
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
        console.log(searchTerm);
    };

    return (
        <>
            {isConnect && (
                <section className="flex justify-center items-start py-10">
                    <div className="gap-8 flex flex-wrap justify-center mx-auto max-w-screen-xl m-5">
                        {/* Filtres de recherche */}
                        <main className=" space-y-6">
                            <div className="flex justify-center items-end gap-5 max-md:flex-wrap">
                                {/* Champ de recherche */}
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
                                {/* Filtre par type */}
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
                                {/* Filtre par localisation */}
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

                            {/* Liste des fournisseurs filtrés */}
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

                            {/* Bouton Ajouter + Pagination */}
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
    );
};

export default ProviderList;
