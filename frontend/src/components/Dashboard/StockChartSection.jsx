import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const StockChartSection = () => {
  // États pour stocker les données des catégories et des produits
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  // États pour stocker les listes complètes des catégories et produits
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  // États pour gérer la catégorie et le produit sélectionnés dans les filtres
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");

  // Chargement initial des données au montage du composant
  useEffect(() => {
    // Récupère la liste des catégories
    axios.get("http://localhost:5000/categories", {withCredentials: true}).then((res) => setCategories(res.data));
    // Récupère la liste des produits
    axios.get("http://localhost:5000/products", {withCredentials: true}).then((res) => setProducts(res.data));
    // Récupère les stocks agrégés par catégorie
    axios.get("http://localhost:5000/stock/categorie").then((res) => setCategoryData(res.data));
    // Récupère les stocks détaillés par produit
    axios.get("http://localhost:5000/stock").then((res) => setProductData(res.data));
  }, []);

  // Filtrage des données des catégories selon la catégorie sélectionnée
  // Si "all" sélectionné, on affiche toutes les catégories
  // Sinon on filtre selon le nom de la catégorie sélectionnée
  const filteredCategoryData = selectedCategory === "all"
      ? categoryData
      : categoryData.filter((c) => c.categorie === categories.find((cat) => cat.id_category === parseInt(selectedCategory))?.nom);

  // Filtrage des données des produits selon catégorie ET produit sélectionnés
  const filteredProductData = productData.filter((p) => {
    const matchCategory = selectedCategory === "all" || p.id_category === parseInt(selectedCategory);
    const matchProduct = selectedProduct === "all" || p.id_product === parseInt(selectedProduct);
    return matchCategory && matchProduct;
  });

  // Liste des produits filtrée selon la catégorie sélectionnée (pour l’option du select)
  const filteredProducts = selectedCategory === "all"
      ? products
      : products.filter((p) => p.id_category === parseInt(selectedCategory));

  return (
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {/* Section graphique par catégorie */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Stock par catégorie</h3>

          {/* Sélecteur pour choisir une catégorie */}
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

          {/* Graphique barre réactif affichant le stock total par catégorie */}
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

        {/* Section graphique par produit */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Stock par produit</h3>

          {/* Sélecteur pour choisir un produit, liste filtrée par catégorie */}
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

          {/* Graphique barre réactif affichant la quantité en stock par produit */}
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
