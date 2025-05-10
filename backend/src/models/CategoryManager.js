const AbstractManager = require("./AbstractManager");

class CategoryManager extends AbstractManager {
  constructor() {
    super({ table: "category" });
  }

  insert(category) {
    return this.database.query(
      `INSERT INTO ${this.table} (nom) VALUES (?)`,
      [category.nom]
    );
  }

  update(id, category) {
    return this.database.query(
      `UPDATE ${this.table} SET nom = ? WHERE id_category = ?`,
      [category.nom, id]
    );
  }

  delete(id) {
    return this.database.query(
      `DELETE FROM ${this.table} WHERE id_category = ?`,
      [id]
    );
  }

  readAll() {
    return this.database.query(`SELECT * FROM ${this.table}`);
  }

  read(id) {
    return this.database.query(
      `SELECT * FROM ${this.table} WHERE id_category = ?`,
      [id]
    );
  }
}

module.exports = CategoryManager;
