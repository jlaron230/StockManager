import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const StockChartSection = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:5000/categories").then((res) => setCategories(res.data));
    axios.get("http://localhost:5000/products", {withCredentials: true}).then((res) => setProducts(res.data));
    axios.get("http://localhost:5000/stock/categorie").then((res) => setCategoryData(res.data));
    axios.get("http://localhost:5000/stock").then((res) => setProductData(res.data));
  }, []);

  const filteredCategoryData = selectedCategory === "all"
    ? categoryData
    : categoryData.filter((c) => c.categorie === categories.find((cat) => cat.id_category === parseInt(selectedCategory))?.nom);

  const filteredProductData = productData.filter((p) => {
    const matchCategory = selectedCategory === "all" || p.id_category === parseInt(selectedCategory);
    const matchProduct = selectedProduct === "all" || p.id_product === parseInt(selectedProduct);
    return matchCategory && matchProduct;
  });

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((p) => p.id_category === parseInt(selectedCategory));

  return (
    <div className="grid md:grid-cols-2 gap-8 mt-10">
      {/* Graphique par Catégorie */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Stock par catégorie</h3>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mb-4 p-2 rounded border dark:bg-gray-700 dark:text-white"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id_category} value={cat.id_category}>{cat.nom}</option>
          ))}
        </select>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredCategoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categorie" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_stock" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique par Produit */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Stock par produit</h3>

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="mb-4 p-2 rounded border dark:bg-gray-700 dark:text-white"
        >
          <option value="all">Tous les produits</option>
          {filteredProducts.map((prod) => (
            <option key={prod.id_product} value={prod.id_product}>{prod.nom}</option>
          ))}
        </select>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredProductData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nom" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantité_en_stock" fill="#38a169" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChartSection;
