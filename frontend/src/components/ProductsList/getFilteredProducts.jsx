export const getFilteredProducts = (products, minpriceValue, maxpriceValue) => {
    if (!minpriceValue && !maxpriceValue) return products;

    return products.filter((product) => {
        const price = product.prix_unitaire;
        const minOk = minpriceValue ? price >= minpriceValue : true;
        const maxOk = maxpriceValue ? price <= maxpriceValue : true;
        return minOk && maxOk;
    });
};