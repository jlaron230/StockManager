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

})