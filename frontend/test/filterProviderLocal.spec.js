import {GetProviderLocalisationFilter} from "../src/components/ProviderList/GetProviderLocalisationFilter";

describe('GetProviderLocalisationFilter', () => {
    const mockProvider = [
        {id: 1, code_postal: '75000'},
        {id: 2, code_postal: '13000'},
        {id: 3, code_postal: '75001'},
    ]

    it('should filter providers by postal code', () => {
        const result = GetProviderLocalisationFilter(mockProvider, '750')
        expect(result).toEqual([
            {id: 1, code_postal: '75000'},
            {id: 3, code_postal: '75001'},
        ])
    });

    it('should return all providers if search is empty', () => {
        const result = GetProviderLocalisationFilter(mockProvider, '')
        expect(result).toEqual(mockProvider)
    });

})