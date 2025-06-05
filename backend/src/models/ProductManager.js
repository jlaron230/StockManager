const AbstractManager = require("./AbstractManager");

class ProductManager extends AbstractManager {
  constructor() {
    super({ table: "product" });
  }

  insert(product) {
    return this.database.query(
      `INSERT INTO ${this.table} 
        (nom, description, prix_unitaire, quantité_en_stock, localisation, date_add, code_product, date_peremption, last_updated, id_admin, image, document, condition_achat, seuil_minimal, id_provider, id_category, created_at, image_prev, image_prev_two)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.nom,
        product.description,
        product.prix_unitaire,
        product.quantité_en_stock,        
        product.localisation,
        product.date_add || null,
        product.code_product,
        product.date_peremption,
        product.last_updated,
        product.id_admin,
        product.image,
        product.document || null,
        product.condition_achat,
        product.seuil_minimal,
        product.id_provider,
        product.id_category,
          product.created_at,
          product.image_prev || null,
          product.image_prev_two || null
      ]
    );
  }

  update(id, product) {
    return this.database.query(
      `UPDATE ${this.table} SET
         nom = ?, description = ?, prix_unitaire = ?, quantité_en_stock = ?, localisation = ?, date_add = ?, code_product = ?, date_peremption = ?, last_updated = ?, image = ?, document = ?, condition_achat = ?, seuil_minimal = ?, id_provider = ?, id_category = ?, image_prev = ?, image_prev_two = ?
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
            //product.id_admin,
            product.image,
            product.document,
            product.condition_achat,
            product.seuil_minimal,
            product.id_provider,
            product.id_category,
            product.image_prev,
            product.image_prev_two,
            id,
      ]
    );
  }
  readAll() {
    return this.database.query(
      `SELECT 
        p.id_product,
        p.nom,
        p.description,
        p.prix_unitaire,
        p.quantité_en_stock,
        p.localisation,
        p.date_add,
        p.code_product,
        p.date_peremption,
        p.last_updated,
        p.id_admin,
        p.image,
        p.document,
        p.condition_achat,
        p.seuil_minimal,
        p.id_category,
        p.id_provider,
        p.created_at,
        p.image_prev,
        p.image_prev_two,
        pr.nom AS nom_fournisseur
       FROM product p
       LEFT JOIN provider pr ON p.id_provider = pr.id_provider`
    );
  }

    incrementStock(id_product, quantity) {
        return this.database.query(
            `UPDATE ${this.table} SET quantité_en_stock = quantité_en_stock + ? WHERE id_product = ?`,
            [quantity, id_product]
        );
    }
  

  read(id) {
    return this.database.query(
      `SELECT 
        p.id_product,
        p.nom,
        p.description,
        p.prix_unitaire,
        p.quantité_en_stock,
        p.localisation,
        p.date_add,
        p.code_product,
        p.date_peremption,
        p.last_updated,
        p.id_admin,
        p.image,
        p.document,
        p.condition_achat,
        p.seuil_minimal,
        p.id_category,
        p.id_provider,
        p.created_at,
        p.image_prev,
        p.image_prev_two,
        pr.nom AS nom_fournisseur
       FROM product p
       LEFT JOIN provider pr ON p.id_provider = pr.id_provider
       WHERE p.id_product = ?`,
      [id]
    );
  }

    decrementStock(id_product, quantity) {
        return this.database.query(
            `UPDATE ${this.table} SET quantité_en_stock = quantité_en_stock - ? WHERE id_product = ?`,
            [quantity, id_product]
        );
    }

    getDetailsByIds(productIds) {
        const placeholders = productIds.map(() => "?").join(",");
        const sql = `
            SELECT id_product, prix_unitaire
            FROM ${this.table}
            WHERE id_product IN (${placeholders})
        `;
        return this.database.query(sql, productIds);
    }
  
  
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id_product = ?`, [id]);
  }

  deleteByProvider(idProvider) {
      return this.database.query(
          `DELETE FROM product WHERE id_provider = ?`,
          [idProvider]
      );
  }

  getProvidersByIds(id) {
    return this.database.query(
      `SELECT id_product, id_provider FROM product WHERE id_product IN (?)`,
      [id]
    );
  }

 findByCategory(id_category) {
  return this.database.query(
    `SELECT * FROM ${this.table} WHERE id_category = ?`,
    [id_category]
  ).then(([rows]) => rows);
}

  
}

module.exports = ProductManager;

