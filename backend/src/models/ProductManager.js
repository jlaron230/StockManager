const AbstractManager = require("./AbstractManager");

class ProductManager extends AbstractManager {
  constructor() {
    super({ table: "product" });
  }

  insert(product) {
    return this.database.query(
      `INSERT INTO ${this.table} 
        (nom, description, prix_unitaire, quantité_en_stock, localisation, date_add, code_product, date_peremption, last_updated, id_admin, image, document, condition_achat, seuil_minimal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.nom,
        product.description,
        product.prix_unitaire,
        product.quantité_en_stock,        
        product.localisation,
        product.date_add,
        product.code_product,
        product.date_peremption,
        product.last_updated,
        product.id_admin,
        product.image,
        product.document,
        product.condition_achat,
        product.seuil_minimal,
      ]
    );
  }

  update(id, product) {
    return this.database.query(
      `UPDATE ${this.table} SET 
       nom = ?, description = ?, prix_unitaire = ?, quantité_en_stock = ?, localisation = ?, date_add = ?, code_product = ?, date_peremption = ?, last_updated = ?, id_admin = ?, image = ?, document = ?, condition_achat = ?, seuil_minimal = ?,
       WHERE id_product = ?`,
      [
        product.nom,
        product.description,
        product.prix_unitaire,
        product.quantité_en_stock,
        product.localisation,
        product.date_add,
        product.code_product,
        product.date_peremption,
        product.last_updated,
        product.id_admin,
        product.image,
        product.document,
        product.condition_achat,
        product.seuil_minimal,
        id,
      ]
    );
  }
  readAll() {
    return this.database.query(`SELECT * FROM ${this.table}`);
  }

  read(id) {
    return this.database.query(`SELECT * FROM ${this.table} WHERE id_product = ?`, [id]);
  }
  
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id_product = ?`, [id]);
  }
  
  
}

module.exports = ProductManager;

