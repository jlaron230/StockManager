import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import OrdersTable from "@components/Order/OrdersTable";
import OrderCrud from "@components/Order/OrderCrud";
import OrderTotals from "@components/Order/OrderTotals";

const initialNavigation = [
    { name: "En cours", current: true },
    { name: "Commander", current: false },
    { name: "Total", current: false },
];

const EnumStatut = [
    "En cours",
    "terminée",
]

const OrderGestion = () => {
    const [isAdmin, setIsAdmin] = useState(true);
    const { id } = useParams();
    const [navigation, setNavigation] = useState(initialNavigation);
    const [ordersAll, setOrdersAll] = useState([]);
    const [user, setUser] = useState([]);
    const [product, setProduct] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedOrder, setEditedOrder] = useState({});

    const fetchAllData = async () => {
        try {
            const [ordersRes, usersRes, productsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`),
            ]);


            const enrichedOrders = await Promise.all(
                ordersRes.data.map(async (order) => {
                    try {
                        const productsRes = await axios.get(
                            `${import.meta.env.VITE_BACKEND_URL}/orders/${order.id_order}/products`
                        );
                        return { ...order, products: productsRes.data };
                    } catch {
                        return { ...order, products: [] };
                    }
                })
            );

            setOrdersAll(enrichedOrders);
            setUser(usersRes.data);
            setProduct(productsRes.data);
        } catch (error) {
            console.error("Erreur de chargement :", error);
        }
    };

    useEffect(() => {
        window.addEventListener("focus", fetchAllData);
        return () => {
            window.removeEventListener("focus", fetchAllData);
        };
    }, []);

    useEffect(() => {
        fetchAllData();
    }, []);


    const handleEdit = async () => {
        // Filtrer uniquement les produits qui correspondent au fournisseur
        const filteredProducts = (editedOrder.products || []).filter((p) => {
            const fullProduct = product.find(prod => prod.id_product === p.id_product);
            return fullProduct && fullProduct.id_provider === editedOrder.id_provider;
        });

        if (filteredProducts.length !== (editedOrder.products || []).length) {
            alert("Certains produits ne correspondent pas au fournisseur sélectionné.");
            return;
        }

        const isValid = editedOrder.products.every((p) =>
            product.some((prod) => prod.id_product === p.id_product)
        );

        if (!isValid) {
            alert("Un ou plusieurs produits sont invalides.");
            return;
        }
        if (editedOrder.is_validated === 1) {
            alert("Cette commande a déjà été validée.");
            return;
        }

        try {
            const payload = {
                id_provider: editedOrder.id_provider,
                is_validated: 1,
                statut: editedOrder.statut,
                id_user: editedOrder.id_user,
                products: filteredProducts.map((p) => {
                    const fullProduct = product.find(prod => prod.id_product === p.id_product);
                    return {
                        id_product: p.id_product,
                        quantité: p.quantité ?? p.quantity,
                    };
                }),
            };

            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/orders/${editedOrder.id_order}`,
                payload, {
                    withCredentials: true
                }
            );

            await fetchAllData();

            setEditingId(null);
            setEditedOrder({});
        } catch (err) {
            console.error("Erreur de mise à jour :", err);
            alert("Échec de la mise à jour de la commande.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newEditedOrder = { ...editedOrder, [name]: value };

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
                        // Optionnel : mettre à jour la quantité si déjà présent
                        exists.quantité = prod.quantité_en_stock || 0;
                    }
                });

                newEditedOrder.products = productsUpdated;
            } else {
                alert("Aucun produit disponible pour l'ajout.");
            }
        }

        setEditedOrder(newEditedOrder);
    };

    const startEdit = async (order) => {
        if(order.is_validated === 0) {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/orders/${order.id_order}/products`
            );
            setEditedOrder({ ...order, products: res.data });
        } catch {
            setEditedOrder(order);
        }
        setEditingId(order.id_order);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditedOrder({});
    };

    const saveEdit = () => {
        handleEdit();
        cancelEdit();
    };

    const switchTab = (index) => {
        const updated = navigation.map((item, i) => ({
            ...item,
            current: i === index,
        }));
        setNavigation(updated);
    };

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
            .then((user) => {
                if (user?.user?.role !== "admin") {
                    // Si connecté mais pas admin, on redirige aussi
                    setIsAdmin(false);
                    navigate("/")
                } else {
                    setIsAdmin(true);
                }
                // Sinon, laisser l'accès à la page
            })
    }, []);

    const classNames = (...classes) => classes.filter(Boolean).join(" ");

    return (
        <>
        {isAdmin ? (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r shadow-sm p-4">
                <h2 className="text-xl font-bold mb-6">Mes commandes</h2>
                <nav className="space-y-2 flex flex-col">
                    {navigation.map((item, index) => (
                        <a
                            key={item.name}
                            onClick={() => switchTab(index)}
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

            {/* Main Content */}
            <main className="flex-1 p-4">
                {navigation[0].current && (
                    <>
                        {ordersAll.length > 0 ? (
                            <>
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
                                />
                            </>
                        ) : (
                            <p>Aucune commande trouvée</p>
                        )}
                    </>
                )}

                {navigation[1].current && <OrderCrud />}
                {navigation[2].current && <OrderTotals ordersAll={ordersAll} />}
            </main>
        </div>
            ) : (
                <div>
                    <p>Chargement</p>
                </div>
            )}
        </>
    );
};

export default OrderGestion;
