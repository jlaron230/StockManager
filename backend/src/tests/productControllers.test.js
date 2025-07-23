jest.mock('../models', () => ({
    product: {
        readAll: jest.fn(),
    },
}));
const tables = require('../models');
const { browse } = require('../controllers/productControllers');

describe('ProductController - browse()', () => {
    let res;

    beforeEach(() => {
        res = {
            json: jest.fn(),
            sendStatus: jest.fn(),
        };
    });

    it('should return list of products (200)', async () => {
        const mockProducts = [
            { id_product: 1, nom: 'Produit A', prix_unitaire: 10 },
            { id_product: 2, nom: 'Produit B', prix_unitaire: 20 },
        ];

        tables.product.readAll.mockResolvedValue([mockProducts, []]);

        await browse({}, res);

        expect(res.json).toHaveBeenCalledWith(mockProducts);
        expect(res.sendStatus).not.toHaveBeenCalled();
    });

    it('should return 500 on error', async () => {
        tables.product.readAll.mockRejectedValue(new Error('DB Error'));

        await browse({}, res);

        expect(res.sendStatus).toHaveBeenCalledWith(500);
        expect(res.json).not.toHaveBeenCalled();
    });
});