const AbstractManager = require("./AbstractManager");

class StockManager extends AbstractManager {
  constructor() {
    super({ table: "product" }); 
  }

  readAllStock() {
    return this.database.query(
      `SELECT id_product, nom, quantité_en_stock FROM ${this.table}`
    );
  }

  readStockByProductId(productId) {
    return this.database.query(
      `SELECT id_product, nom, quantité_en_stock FROM ${this.table} WHERE id_product = ?`,
      [productId]
    );
  }

  getLowStockProducts() {
   return this.database.query(
     `SELECT id_product, nom, quantité_en_stock, seuil_minimal FROM ${this.table} WHERE quantité_en_stock < seuil_minimal`,
    );
}
}

module.exports = StockManager;
