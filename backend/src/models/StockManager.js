const AbstractManager = require("./AbstractManager");

// Classe StockManager pour gérer les opérations liées aux produits et stocks
class StockManager extends AbstractManager {
    constructor() {
        super({ table: "product" }); // Initialise la table "product"
    }

    // Récupère tous les produits avec leurs quantités en stock et catégories
    readAllStock() {
        return this.database.query(
            `SELECT id_product, nom, quantité_en_stock, id_category FROM ${this.table}`
        );
    }

    // Récupère le stock d'un produit spécifique via son ID
    readStockByProductId(productId) {
        return this.database.query(
            `SELECT id_product, nom, quantité_en_stock, id_category FROM ${this.table} WHERE id_product = ?`,
            [productId]
        );
    }

    // Récupère les produits dont le stock est inférieur au seuil minimal défini
    getLowStockProducts() {
        return this.database.query(
            `SELECT id_product, nom, quantité_en_stock, seuil_minimal FROM ${this.table} WHERE quantité_en_stock < seuil_minimal`,
        );
    }

    // Calcule le stock total par catégorie en sommant les quantités en stock
    getTotalStockByCategory() {
        return this.database.query(`
            SELECT c.nom AS categorie, SUM(p.quantité_en_stock) AS total_stock
            FROM product p
                     JOIN category c ON p.id_category = c.id_category
            GROUP BY c.nom
        `);
    }
}

module.exports = StockManager;
