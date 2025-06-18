import {getFilteredProducts} from "../src/components/ProductsList/getFilteredProducts";

describe('getFilteredProducts', () => {
    const mockProducts = [
        {id: 1, prix_unitaire: 10},
        {id: 2, prix_unitaire: 20},
        {id: 3, prix_unitaire: 40},
        ]

test("renvoi les produits si aucun filtre", () => {
    const result = getFilteredProducts(mockProducts, null, null)
    expect(result).toEqual(mockProducts)
})

    test("filtre uniquement avec minfiltre price", () => {
        const result = getFilteredProducts(mockProducts, 20, null)
        expect(result).toEqual([{id: 2, prix_unitaire: 20},
            {id: 3, prix_unitaire: 40}],)
    })

    test("filtre uniquement avec maxfiltre price", () => {
        const result = getFilteredProducts(mockProducts, null, 20)
        expect(result).toEqual([{id: 1, prix_unitaire: 10},
        {id: 2, prix_unitaire: 20}])
    })

})
