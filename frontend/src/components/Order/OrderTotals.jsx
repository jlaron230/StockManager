import React, { useEffect, useState } from "react";

const OrderTotals = () => {
    const [orderProducts, setOrderProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Récupération des données à partir du backend
    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders-total`);
                const data = await response.json();
                setOrderProducts(data);
            } catch (error) {
                console.error("Erreur lors du fetch des totaux:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTotals();
    }, []);
console.log(orderProducts);
    // Calcul du montant total
    const totalAmount = orderProducts.reduce((total, item) => {
        const quantity = item.quantité_commandée ?? 0;
        const unitPrice = item.unit_price ?? 0;
        return total + quantity * unitPrice;
    }, 0);

    return (
        <div className="p-6 bg-white rounded-2xl shadow-md max-w-2xl mx-auto my-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Montant total des commandes (5 produits)
            </h2>

            {isLoading ? (
                <p className="text-gray-500 text-center">Chargement...</p>
            ) : (
                <div>
                    <p className="text-3xl font-extrabold text-green-600 text-center mb-6">
                        {totalAmount.toFixed(2)} €
                    </p>

                    <div className="space-y-4">
                        {orderProducts.map((product, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow transition"
                            >
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700">Nom du produit</h3>
                                        <p className="text-base text-gray-900">{product.nom}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700">Quantité commandée</h3>
                                        <p className="text-base text-gray-900">{product.quantité_commandée}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


export default OrderTotals;