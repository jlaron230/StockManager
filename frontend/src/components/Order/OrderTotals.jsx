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
        <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto my-6">
            <h2 className="text-xl font-semibold mb-2">Montant total des commandes réalisées sur 5 produits</h2>
            {isLoading ? (
                <p className="text-gray-500">Chargement...</p>
            ) : (
                <div>
                    <p className="text-lg font-bold text-green-600">
                        {totalAmount.toFixed(2)}
                    </p>
                    {orderProducts.map((product) => (
                        <>
                            <div className="flex items-center flex-wrap justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold">Nom de produit</h2>
                            <p className="text-lg text-black-600">
                                {product.nom}
                            </p>
                        </div>

                            <div>
                                <h2 className="text-xl font-bold">Quantité commandée</h2>
                                <p className="text-lg text-black-600">
                                    {product.quantité_commandée}
                                </p>
                            </div>
                            </div>
                        </>
                    ))}

                        </div>
                    )}
        </div>
    );
};

export default OrderTotals;