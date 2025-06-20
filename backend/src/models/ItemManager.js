const AbstractManager = require("./AbstractManager");

class ItemManager extends AbstractManager {
  constructor() {
    super({ table: "item" }); // Définit la table associée aux items
  }

  // Insère un nouvel item avec un titre
  insert(item) {
    return this.database.query(`insert into ${this.table} (title) values (?)`, [
      item.title,
    ]);
  }

  // Met à jour le titre d'un item existant via son id
  update(item) {
    return this.database.query(
        `update ${this.table} set title = ? where id = ?`,
        [item.title, item.id]
    );
  }
}

module.exports = ItemManager;
