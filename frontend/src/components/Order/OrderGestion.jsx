import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import OrdersTable from "@components/Order/OrdersTable";
import OrderCrud from "@components/Order/OrderCrud";
import OrderTotals from "@components/Order/OrderTotals";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {Bars2Icon} from "@heroicons/react/16/solid";

// Navigation initiale pour les onglets
const initialNavigation = [
    { name: "En cours", current: true },
    { name: "Commander", current: false },
    { name: "Total", current: false },
];

// Statuts possibles d'une commande
const EnumStatut = [
    "En cours",
    "terminée",
]

const OrderGestion = () => {
    // Etats principaux
    const [isAdmin, setIsAdmin] = useState(true); // Droit admin
    const { id } = useParams(); // ID depuis l'URL
    const [navigation, setNavigation] = useState(initialNavigation); // Onglet actif
    const [ordersAll, setOrdersAll] = useState([]); // Toutes commandes
    const [user, setUser] = useState([]); // Utilisateurs
    const [product, setProduct] = useState([]); // Produits
    const [editingId, setEditingId] = useState(null); // ID commande en édition
    const [editedOrder, setEditedOrder] = useState({}); // Commande éditée
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Menu mobile

    // Chargement des données (commandes, utilisateurs, produits)
    const fetchAllData = async () => {
        try {
            // Récupération parallèle
            const [ordersRes, usersRes, productsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders`, { withCredentials: true }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`, { withCredentials: true }),
            ]);

            // Pour chaque commande, récupérer les produits associés
            const enrichedOrders = await Promise.all(
                ordersRes.data.map(async (order) => {
                    try {
                        const productsRes = await axios.get(
                            `${import.meta.env.VITE_BACKEND_URL}/orders/${order.id_order}/products`,
                            { withCredentials: true });
                        return { ...order, products: productsRes.data };
                    } catch {
                        return { ...order, products: [] };
                    }
                })
            );

            // Mettre à jour les états
            setOrdersAll(enrichedOrders);
            setUser(usersRes.data);
            setProduct(productsRes.data);
        } catch (error) {
            console.error("Erreur de chargement :", error);
        }
    };

    // Rafraîchir les données quand la fenêtre retrouve le focus
    useEffect(() => {
        window.addEventListener("focus", fetchAllData);
        return () => {
            window.removeEventListener("focus", fetchAllData);
        };
    }, []);

    // Chargement initial des données au montage
    useEffect(() => {
        fetchAllData();
    }, []);

    // Validation et mise à jour d'une commande éditée
    const handleEdit = async () => {
        // Ne garder que les produits du bon fournisseur
        const filteredProducts = (editedOrder.products || []).filter((p) => {
            const fullProduct = product.find(prod => prod.id_product === p.id_product);
            return fullProduct && fullProduct.id_provider === editedOrder.id_provider;
        });

        // Vérifier que tous les produits correspondent au fournisseur
        if (filteredProducts.length !== (editedOrder.products || []).length) {
            alert("Certains produits ne correspondent pas au fournisseur sélectionné.");
            return;
        }

        // Vérifier que les produits sont valides
        const isValid = editedOrder.products.every((p) =>
            product.some((prod) => prod.id_product === p.id_product)
        );

        if (!isValid) {
            alert("Un ou plusieurs produits sont invalides.");
            return;
        }

        // Empêcher la modification si commande déjà validée
        if (editedOrder.is_validated === 1) {
            alert("Cette commande a déjà été validée.");
            return;
        }

        try {
            // Préparer les données à envoyer
            const payload = {
                id_provider: editedOrder.id_provider,
                is_validated: 1,
                statut: editedOrder.statut,
                id_user: editedOrder.id_user,
                products: filteredProducts.map((p) => ({
                    id_product: p.id_product,
                    quantité: p.quantité ?? p.quantity,
                })),
            };

            // Envoi des modifications au serveur
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/orders/${editedOrder.id_order}`,
                payload, {
                    withCredentials: true
                }
            );

            // Rafraîchir les données et reset édition
            await fetchAllData();
            setEditingId(null);
            setEditedOrder({});
        } catch (err) {
            console.error("Erreur de mise à jour :", err);
            alert("Échec de la mise à jour de la commande.");
        }
    };

    // Gestion des changements dans le formulaire d'édition
    const handleChange = (e) => {
        const { name, value } = e.target;
        let newEditedOrder = { ...editedOrder, [name]: value };

        // Si statut changé à "terminée", ajouter tous les produits du fournisseur
        if (name === "statut" && value === "terminée") {
            if (product.length > 0) {
                const prodsToAdd = product.filter(p => p.id_provider === newEditedOrder.id_provider);
                const productsUpdated = [...(newEditedOrder.products || [])];

                prodsToAdd.forEach(prod => {
                    const exists = productsUpdated.find(p => p.id_product === prod.id_product);
                    if (!exists) {
                        productsUpdated.push({
                            id_product: prod.id_product,
                            quantité: prod.quantité_en_stock || 0,
                        });
                    } else {
                        exists.quantité = prod.quantité_en_stock || 0; // Met à jour la quantité
                    }
                });

                newEditedOrder.products = productsUpdated;
            } else {
                alert("Aucun produit disponible pour l'ajout.");
            }
        }

        setEditedOrder(newEditedOrder);
    };

    // Début de l'édition d'une commande (récupère produits associés)
    const startEdit = async (order) => {
        if(order.is_validated === 0) {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/orders/${order.id_order}/products`, { withCredentials: true }
                );
                setEditedOrder({ ...order, products: res.data });
            } catch {
                setEditedOrder(order);
            }
            setEditingId(order.id_order);
        }
    };

    // Annule l'édition en cours
    const cancelEdit = () => {
        setEditingId(null);
        setEditedOrder({});
    };

    // Sauvegarde l'édition en cours
    const saveEdit = () => {
        handleEdit();
        cancelEdit();
    };

    // Change l'onglet actif
    const switchTab = (index) => {
        const updated = navigation.map((item, i) => ({
            ...item,
            current: i === index,
        }));
        setNavigation(updated);
    };

    // Suppression d'une commande
    const deleteOrder = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/orders/${id}`,{
                withCredentials: true
            });
            setOrdersAll((prev) => prev.filter((o) => o.id_order !== id));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("Erreur lors de la suppression de la commande.");
        }
    };

    const navigate = useNavigate();

    // Vérifie la session utilisateur et le rôle admin au chargement
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/session`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    navigate("/") // redirige si pas connecté
                } else {
                    return res.json();
                }
            })
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    setIsAdmin(false);
                    navigate("/connexion") // redirige si pas admin
                } else {
                    setIsAdmin(true);
                }
            })
    }, []);

    // Fonction utilitaire pour concaténer des classes CSS conditionnelles
    const classNames = (...classes) => classes.filter(Boolean).join(" ");

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Barre supérieure visible uniquement sur mobile */}
            <div className="flex justify-between items-center lg:hidden bg-white p-4 border-b">
                <h2 className="text-xl font-bold hidden lg:block">Mes commandes</h2>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700">
                    {mobileMenuOpen ? (
                        <XMarkIcon className="w-6 h-6"/>
                    ) : (
                        <Bars2Icon className="w-6 h-6"/>
                    )}
                </button>
            </div>

            {/* Menu latéral */}
            <aside
                className={classNames(
                    "bg-white border-r shadow-sm p-4 w-64 z-40 transition-transform duration-300 ease-in-out",
                    "fixed top-0 left-0 h-full lg:static lg:translate-x-0",
                    "lg:h-screen lg:flex lg:flex-col",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex justify-between items-center lg:hidden mb-4">
                    <h2 className="text-xl font-bold">Menu commande</h2>
                    <button onClick={() => setMobileMenuOpen(false)}><XMarkIcon className="w-6 h-6"/></button>
                </div>
                <nav className="space-y-2 flex flex-col">
                    <h2 className="text-xl font-bold mb-8">Menu commande</h2>
                    {navigation.map((item, index) => (
                        <a
                            key={item.name}
                            onClick={() => {
                                switchTab(index);
                                setMobileMenuOpen(false); // Ferme le menu sur mobile après clic
                            }}
                            className={classNames(
                                item.current ? "text-color-picto" : "text-color hover:text-white",
                                "cursor-pointer rounded-md px-3 py-2 text-lg font-medium"
                            )}
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Fond sombre derrière menu mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50  z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Contenu principal */}
            <main className="flex-1 p-4 overflow-auto">
                {/* Onglet "En cours" */}
                {navigation[0].current && (
                    <>
                        {ordersAll.length > 0 ? (
                            <OrdersTable
                                statutOptions={EnumStatut}
                                user={user}
                                ordersAll={ordersAll}
                                editingId={editingId}
                                editedOrder={editedOrder}
                                handleChange={handleChange}
                                startEdit={startEdit}
                                cancelEdit={cancelEdit}
                                saveEdit={saveEdit}
                                deleteOrder={deleteOrder}
                                isValidated={ordersAll}
                                products={product}
                            />
                        ) : (
                            <p>Aucune commande trouvée</p>
                        )}
                    </>
                )}

                {/* Onglet "Commander" */}
                {navigation[1].current && <OrderCrud/>}
                {/* Onglet "Total" */}
                {navigation[2].current && <OrderTotals ordersAll={ordersAll}/>}
            </main>
        </div>
    );
};

export default OrderGestion;
