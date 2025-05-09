const AbstractManager = require("./AbstractManager");

class ProviderManager extends AbstractManager {
  constructor() {
    super({ table: "provider" });
  }

  insert(provider) {
    return this.database.query(
      `INSERT INTO ${this.table} 
        (nom, email, telephone, type, id_admin, adresse, code_postal, commentaire, id_category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        provider.nom,
        provider.email,
        provider.telephone,
        provider.type,
        provider.id_admin,
        provider.adresse,
        provider.code_postal,
        provider.commentaire,
        provider.id_category,
      ]
    );
  }

  update(id, provider) {
    return this.database.query(
      `UPDATE ${this.table} SET 
        nom = ?, email = ?, telephone = ?, type = ?, id_admin = ?, adresse = ?, code_postal = ?, commentaire = ?, id_category = ?
       WHERE id_provider = ?`,
      [
        provider.nom,
        provider.email,
        provider.telephone,
        provider.type,
        provider.id_admin,
        provider.adresse,
        provider.code_postal,
        provider.commentaire,
        provider.id_category,
        id,
      ]
    );
  }
  readAll() {
    return this.database.query(
      `SELECT 
        p.*, 
        c.nom AS nom_categorie
       FROM provider p
       LEFT JOIN category c ON p.id_category = c.id_category`
    );
  }
  

  read(id) {
    return this.database.query(
      `SELECT 
        p.*, 
        c.nom AS nom_categorie
       FROM provider p
       LEFT JOIN category c ON p.id_category = c.id_category
       WHERE p.id_provider = ?`,
      [id]
    );
  }
  
  
  delete(id) {
    return this.database.query(`DELETE FROM ${this.table} WHERE id_provider = ?`, [id]);
  }
  
  findByCategoryId(categoryId) {
    return this.database.query(
      `SELECT 
        p.*, 
        c.nom AS nom_categorie
       FROM provider p
       LEFT JOIN category c ON p.id_category = c.id_category
       WHERE p.id_category = ?`,
      [categoryId]
    );
  }
  
  findCategoryId(providerId) {
    return this.database.query(
      `SELECT id_category FROM provider WHERE id_provider = ?`,
      [providerId]
    );
  }
  
  
}

module.exports = ProviderManager;

