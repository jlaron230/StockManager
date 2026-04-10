import React, { useState } from 'react';
import ModalProduct from "@components/ProductsList/ModalProduct";

const OrdersTable = ({
                         ordersAll,
                         editingId,
                         editedOrder,
                         handleChange,
                         startEdit,
                         cancelEdit,
                         saveEdit,
                         deleteOrder,
                         user,
                         statutOptions,
                         isValidated,
                         products,
                     }) => {
    const [selectedOrderToDelete, setSelectedOrderToDelete] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = ordersAll.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(ordersAll.length / ordersPerPage);

    const handleDeleteClick = (orderId) => {
       // console.log("Suppression demandée pour l’ID :", orderId);
        setSelectedOrderToDelete(orderId);
    };

    const handleConfirmDelete = () => {
        if (selectedOrderToDelete !== null) {
            deleteOrder(selectedOrderToDelete);
            setSelectedOrderToDelete(null);
        }
    };

    const handleCloseModal = () => {
        setSelectedOrderToDelete(null);
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Commandes en cours</h1>

            <div className="overflow-x-auto rounded-lg border shadow-sm bg-white">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b hidden sm:table-header-group">
                    <tr>
                        <th className="p-3 sm:p-4">ID</th>
                        <th className="p-3 sm:p-4">Employé</th>
                        <th className="p-3 sm:p-4">Status commande</th>
                        <th className="p-3 sm:p-4">Montant</th>
                        <th className="p-3 sm:p-4">Produit</th>
                        <th className="p-3 sm:p-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentOrders.map((order) => {
                        const relatedUser = user.find(u => u.id_user === order.id_user);
                        return (
                            <tr
                                key={order.id_order}
                                className="border-b hover:bg-gray-50 flex flex-col sm:table-row"
                            >
                                <td className="p-3 sm:p-4 font-medium text-gray-800 sm:table-cell">
                                    <span className="font-semibold sm:hidden">ID : </span>{order.id_order}
                                </td>
                                <td className="p-3 sm:p-4 sm:table-cell">
                                    <span className="font-semibold sm:hidden">Employé : </span>
                                    {relatedUser ? relatedUser.nom : 'Inconnu'}
                                </td>
                                <td className="p-3 sm:p-4 sm:table-cell">
                                    <span className="font-semibold sm:hidden">Statut : </span>
                                    {editingId === order.id_order ? (
                                        <select
                                            name="statut"
                                            value={editedOrder.statut}
                                            onChange={handleChange}
                                            className="border px-2 py-1 rounded-md w-full sm:w-32"
                                        >
                                            {statutOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option.replace("_", " ")}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        order.statut
                                    )}
                                </td>
                                <td className="p-3 sm:p-4 sm:table-cell">
                                    <span className="font-semibold sm:hidden">Montant : </span>
                                    {order.total_ammount} €
                                </td>
                                <td className="p-3 sm:p-4 flex flex-wrap gap-2">
                                    <span className="font-semibold sm:hidden">Produit : </span>
                                    {order.products?.map((p, idx) => {
                                        const fullProduct = products.find(prod => prod.id_product === p.id_product);
                                        return (
                                            <span key={idx}>
                                                    {fullProduct ? fullProduct.nom : "Produit inconnu"}
                                                </span>
                                        );
                                    })}
                                </td>
                                <td className="p-3 sm:p-4 text-right sm:table-cell flex justify-end gap-2">
                                    {editingId === order.id_order ? (
                                        <>
                                            <button
                                                aria-label="sauvegarde d'une commande"
                                                onClick={saveEdit}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                disabled={order.is_validated === 1}
                                            >
                                                Sauvegarder
                                            </button>
                                            <button
                                                aria-label="annuler l'édition"
                                                onClick={cancelEdit}
                                                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Annuler
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                aria-label="Édition d'une commande"
                                                onClick={() => startEdit(order)}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                disabled={order.is_validated === 1}
                                            >
                                                Éditer
                                            </button>
                                            <button
                                                aria-label="suppression d'une commande"
                                                onClick={() => handleDeleteClick(order.id_order)}
                                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    {ordersAll.length === 0 && (
                        <tr>
                            <td colSpan="5" className="p-4 text-center text-gray-500">
                                Aucune commande trouvée.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {ordersAll.length > ordersPerPage && (
                <div className="flex justify-center items-center mt-4 gap-4">
                    <button aria-label="bouton page précédente"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span className="text-sm font-medium">
                        Page {currentPage} sur {totalPages}
                    </span>
                    <button aria-label="bouton page suivante"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            )}

            {selectedOrderToDelete !== null && (
                <ModalProduct
                    nameModal="Supprimer la commande"
                    descriptionModal="Êtes-vous sûr de vouloir supprimer la commande ?"
                    modalOpen={false}
                    setModalOpen={handleCloseModal}
                    supp={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default OrdersTable;
