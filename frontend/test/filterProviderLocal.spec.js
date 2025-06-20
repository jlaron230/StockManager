// On importe la fonction à tester
import { GetProviderLocalisationFilter } from "../src/components/ProviderList/GetProviderLocalisationFilter";

// Bloc de tests pour la fonction GetProviderLocalisationFilter
describe('GetProviderLocalisationFilter', () => {

    // Données simulées : trois fournisseurs avec différents codes postaux
    const mockProvider = [
        { id: 1, code_postal: '75000' },
        { id: 2, code_postal: '13000' },
        { id: 3, code_postal: '75001' },
    ];

    // 🧪 Test 1 : filtrer les fournisseurs dont le code postal commence par "750"
    it('should filter providers by postal code', () => {
        const result = GetProviderLocalisationFilter(mockProvider, '750');

        // Doit retourner uniquement les fournisseurs avec un code postal commençant par "750"
        expect(result).toEqual([
            { id: 1, code_postal: '75000' },
            { id: 3, code_postal: '75001' },
        ]);
    });

    // 🧪 Test 2 : aucun filtre → renvoyer tous les fournisseurs
    it('should return all providers if search is empty', () => {
        const result = GetProviderLocalisationFilter(mockProvider, '');

        // Doit retourner tous les fournisseurs
        expect(result).toEqual(mockProvider);
    });

});
