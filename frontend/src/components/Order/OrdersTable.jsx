import React, {useState} from 'react';
import ButtonSupp from "@components/Button/ButtonSupp";
import ModalProduct from "@components/ProductsList/ModalProduct";
import product from "@pages/Product";

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
    // État pour gérer l'ID de la commande à supprimer (pour la modale)
    const [selectedOrderToDelete, setSelectedOrderToDelete] = useState(null);

    // Ouvre la modale de confirmation de suppression
    const handleDeleteClick = (orderId) => {
        console.log("Suppression demandée pour l’ID :", orderId);
        setSelectedOrderToDelete(orderId);
    };

    // Confirme la suppression, appelle la fonction deleteOrder puis ferme la modale
    const handleConfirmDelete = () => {
        if (selectedOrderToDelete !== null) {
            deleteOrder(selectedOrderToDelete);
            setSelectedOrderToDelete(null); // Fermer la modale
        }
    };

    // Ferme la modale sans supprimer
    const handleCloseModal = () => {
        setSelectedOrderToDelete(null);
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Titre de la section */}
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Commandes en cours</h1>

            {/* Tableau des commandes */}
            <div className="overflow-x-auto rounded-lg border shadow-sm bg-white">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b hidden sm:table-header-group">
                    <tr>
                        {/* Entêtes du tableau */}
                        <th className="p-3 sm:p-4">ID</th>
                        <th className="p-3 sm:p-4">Employé</th>
                        <th className="p-3 sm:p-4">Status commande</th>
                        <th className="p-3 sm:p-4">Montant</th>
                        <th className="p-3 sm:p-4">Produit</th>
                        <th className="p-3 sm:p-4">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Parcours des commandes */}
                    {ordersAll.map((order) => {
                        // Trouve l'utilisateur lié à la commande
                        const relatedUser = user.find(u => u.id_user === order.id_user);
                        return (
                            <tr
                                key={order.id_order}
                                className="border-b hover:bg-gray-50 flex flex-col sm:table-row"
                            >
                                {/* Affichage ID commande */}
                                <td className="p-3 sm:p-4 font-medium text-gray-800 sm:table-cell">
                                    <span className="font-semibold sm:hidden">ID : </span>{order.id_order}
                                </td>

                                {/* Nom de l'employé */}
                                <td className="p-3 sm:p-4 sm:table-cell">
                                    <span className="font-semibold sm:hidden">Employé : </span>
                                    {relatedUser ? relatedUser.nom : 'Inconnu'}
                                </td>

                                {/* Statut commande : affichage ou édition selon editingId */}
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

                                {/* Montant total */}
                                <td className="p-3 sm:p-4 sm:table-cell">
                                    <span className="font-semibold sm:hidden">Montant : </span>
                                    {order.total_ammount}
                                </td>

                                {/* Liste des produits liés à la commande */}
                                <td className="p-3 sm:p-4 flex flex-wrap gap-2">
                                    <span className="font-semibold sm:hidden">Produit : </span>
                                    {order.products?.map((p, idx) => {
                                        // Trouve le produit complet pour afficher le nom
                                        const fullProduct = products.find(prod => prod.id_product === p.id_product);
                                        return (
                                            <span key={idx}>
                                                {fullProduct ? fullProduct.nom : "Produit inconnu"}
                                            </span>
                                        );
                                    })}
                                </td>

                                {/* Actions : Éditer / Supprimer ou Sauvegarder / Annuler */}
                                <td className="p-3 sm:p-4 text-right sm:table-cell flex justify-end gap-2">
                                    {editingId === order.id_order ? (
                                        <>
                                            <button
                                                onClick={saveEdit}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                disabled={order.is_validated === 1}
                                            >
                                                Sauvegarder
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Annuler
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    onClick={() => startEdit(order)}
                                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    disabled={order.is_validated === 1}
                                                >
                                                    Éditer
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(order.id_order)}
                                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    {/* Message si aucune commande */}
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

            {/* Modale confirmation suppression */}
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
