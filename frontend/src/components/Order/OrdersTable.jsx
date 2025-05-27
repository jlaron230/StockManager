import React from 'react';

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
                     }) => {

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Commandes en cours</h1>

            <div className="overflow-x-auto rounded-lg border shadow-sm bg-white">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Employé</th>
                        <th className="p-4">Status commande</th>
                        <th className="p-4">Montant</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ordersAll.map((order) => {
                        const relatedUser = user.find(u => u.id_user === order.id_user);
                        return (
                            <tr key={order.id_order} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{order.id_order}</td>
                                <td className="p-4">
                                    {relatedUser ? relatedUser.nom : 'Unknown'}
                                </td>
                                <td className="p-4">
                                    {editingId === order.id_order ? (
                                        <select
                                            name="statut"
                                            value={editedOrder.statut}
                                            onChange={handleChange}
                                            className="border px-2 py-1 rounded-md w-32 transition duration-200"
                                        >
                                            {statutOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option.replace("_", " ")} {/* lisible */}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        order.statut
                                    )}
                                </td>
                                <td className="p-4">
                                    {order.total_ammount}
                                </td>
                                <td className="p-4 text-right flex gap-2 justify-end">
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
                                            <button
                                                onClick={() => startEdit(order)}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                disabled={order.is_validated === 1}
                                            >
                                                Éditer
                                            </button>
                                            <button
                                                onClick={() => deleteOrder(order.id_order)}
                                                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Supprimer
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    {ordersAll.length === 0 && (
                        <tr>
                            <td colSpan="5" className="p-4 text-center text-gray-500">
                                No orders found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
