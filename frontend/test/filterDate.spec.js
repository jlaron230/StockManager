import {GetFilteredDate} from "../src/components/ProductsList/GetFilteredDate";

describe('GetFilteredDate', () => {
    const mockProductsDate = [
        {id: 1, date_add: '2024-01-01'},
        {id: 2, date_add: '2024-06-01'},
    ]

    test("renvoi les dates si le filtre est faux", () => {
        const result = GetFilteredDate(mockProductsDate, false)
        expect(result.map(p => p.id)).toEqual([1,2])
    })

})