// On importe la fonction à tester
import { getFilteredProducts } from "../src/components/ProductsList/getFilteredProducts";

// Bloc de tests pour getFilteredProducts
describe('getFilteredProducts', () => {
    // Données simulées : trois produits avec des prix différents
    const mockProducts = [
        { id: 1, prix_unitaire: 10 },
        { id: 2, prix_unitaire: 20 },
        { id: 3, prix_unitaire: 40 },
    ];

    // 🧪 Test 1 : aucun filtre (min et max null)
    test("renvoie tous les produits si aucun filtre", () => {
        const result = getFilteredProducts(mockProducts, null, null);
        expect(result).toEqual(mockProducts); // Doit retourner tous les produits
    });

    // 🧪 Test 2 : filtre avec seulement un prix minimum
    test("filtre uniquement avec min price", () => {
        const result = getFilteredProducts(mockProducts, 20, null);
        // Ne garde que les produits >= 20
        expect(result).toEqual([
            { id: 2, prix_unitaire: 20 },
            { id: 3, prix_unitaire: 40 },
        ]);
    });

    // 🧪 Test 3 : filtre avec seulement un prix maximum
    test("filtre uniquement avec max price", () => {
        const result = getFilteredProducts(mockProducts, null, 20);
        // Ne garde que les produits <= 20
        expect(result).toEqual([
            { id: 1, prix_unitaire: 10 },
            { id: 2, prix_unitaire: 20 },
        ]);
    });
});
