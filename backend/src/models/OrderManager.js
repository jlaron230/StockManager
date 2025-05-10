const AbstractManager = require("./AbstractManager");

class OrderManager extends AbstractManager {
  constructor() {
    super({ table: "`order`" }); // Protégé par backticks car "order" est un mot réservé SQL
  }

  insert(order) {
    return this.database.query(
      `INSERT INTO ${this.table} (date_commande, statut, total_ammount, id_user, id_provider)
       VALUES (?, ?, ?, ?, ?)`,
      [order.date_commande, order.statut, order.total_ammount, order.id_user, order.id_provider]
    );
  }

  read(id) {
    return this.database.query(
      `SELECT * FROM ${this.table} WHERE id_order = ?`,
      [id]
    );
  }

  readStatus(id) {
    return this.database.query(
      `SELECT statut FROM ${this.table} WHERE id_order = ?`,
      [id]
    );
  }

  updateTotal(id_order, total) {
    return this.database.query(
      `UPDATE ${this.table} SET total_ammount = ? WHERE id_order = ?`,
      [total, id_order]
    );
  }
  
}

module.exports = OrderManager;
