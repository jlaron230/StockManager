const AbstractManager = require("./AbstractManager");

class StockManager extends AbstractManager {
  constructor() {
    super({ table: "product" }); 
  }

  readAllStock() {
    return this.database.query(
      `SELECT id_product, nom, quantité_en_stock, id_category FROM ${this.table}`
    );
  }

  readStockByProductId(productId) {
    return this.database.query(
      `SELECT id_product, nom, quantité_en_stock, id_category FROM ${this.table} WHERE id_product = ?`,
      [productId]
    );
  }

  getLowStockProducts() {
   return this.database.query(
     `SELECT id_product, nom, quantité_en_stock, seuil_minimal FROM ${this.table} WHERE quantité_en_stock < seuil_minimal`,
    );
}

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
