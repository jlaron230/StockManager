const AbstractManager = require("./AbstractManager");

class CategoryManager extends AbstractManager {
  constructor() {
    super({ table: "category" }); // Définit la table 'category' pour ce manager
  }

  // Insère une nouvelle catégorie avec un nom
  insert(category) {
    return this.database.query(
        `INSERT INTO ${this.table} (nom) VALUES (?)`,
        [category.nom]
    );
  }

  // Met à jour le nom d'une catégorie existante par son ID
  update(id, category) {
    return this.database.query(
        `UPDATE ${this.table} SET nom = ? WHERE id_category = ?`,
        [category.nom, id]
    );
  }

  // Supprime une catégorie par son ID
  delete(id) {
    return this.database.query(
        `DELETE FROM ${this.table} WHERE id_category = ?`,
        [id]
    );
  }

  // Récupère toutes les catégories
  readAll() {
    return this.database.query(`SELECT * FROM ${this.table}`);
  }

  // Récupère une catégorie spécifique par son ID
  read(id) {
    return this.database.query(
        `SELECT * FROM ${this.table} WHERE id_category = ?`,
        [id]
    );
  }
}

module.exports = CategoryManager;
