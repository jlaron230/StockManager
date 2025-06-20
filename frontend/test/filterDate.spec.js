// On importe la fonction à tester
import { GetFilteredDate } from "../src/components/ProductsList/GetFilteredDate";

// Début du bloc de test pour la fonction GetFilteredDate
describe('GetFilteredDate', () => {

    // Données simulées : deux produits avec des dates différentes
    const mockProductsDate = [
        { id: 1, date_add: '2024-01-01' },
        { id: 2, date_add: '2024-06-01' },
    ];

    // Test : vérifier que la fonction renvoie tous les produits si le filtre est désactivé (false)
    test("renvoie les dates si le filtre est faux", () => {
        const result = GetFilteredDate(mockProductsDate, false);

        // On s'attend à ce que la fonction retourne les deux produits
        expect(result.map(p => p.id)).toEqual([1, 2]);
    });

});
