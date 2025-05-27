import { useEffect, useState } from "react";
import axios from "axios";

const StockAlertSection = () => {
  const [criticalStocks, setCriticalStocks] = useState([]);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true); // 🔁 état déroulant

  useEffect(() => {
    const fetchCriticalStock = async () => {
      try {
        const res = await axios.get("http://localhost:5000/stock/low", {
          withCredentials: true,
        });
        setCriticalStocks(res.data);
      } catch (err) {
        console.error("Erreur chargement stock critique :", err);
        setError("Erreur lors du chargement des produits critiques.");
      }
    };

    fetchCriticalStock();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-8">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center text-left"
      >
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
          Produits en stock critique
        </h2>
        <span className="text-2xl">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <>
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {criticalStocks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300 mt-4">
              Aucun produit critique.
            </p>
          ) : (
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-300 mt-4">
              <thead className="text-xs text-gray-700 uppercase bg-red-100 dark:bg-red-900 dark:text-red-300">
                <tr>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">Quantité</th>
                  <th className="px-4 py-3">Seuil</th>
                </tr>
              </thead>
              <tbody>
                {criticalStocks.map((item) => (
                  <tr key={item.id_product} className="border-b dark:border-gray-700">
                    <td className="px-4 py-3">{item.nom}</td>
                    <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">
                      {item["quantité_en_stock"]}
                    </td>
                    <td className="px-4 py-3">{item["seuil_minimal"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default StockAlertSection;
