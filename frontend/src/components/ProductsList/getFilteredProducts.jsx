// Fonction pour filtrer les produits selon une plage de prix minimum et maximum
export const getFilteredProducts = (products, minpriceValue, maxpriceValue) => {
    // Si aucune valeur min et max n'est définie, retourner tous les produits
    if (!minpriceValue && !maxpriceValue) return products;

    // Filtrer les produits
    return products.filter((product) => {
        const price = product.prix_unitaire; // Prix unitaire du produit

        // Vérifie si le prix est supérieur ou égal au minimum (si défini)
        const minOk = minpriceValue ? price >= minpriceValue : true;

        // Vérifie si le prix est inférieur ou égal au maximum (si défini)
        const maxOk = maxpriceValue ? price <= maxpriceValue : true;

        // Le produit est gardé s’il respecte à la fois le minimum et le maximum
        return minOk && maxOk;
    });
};
