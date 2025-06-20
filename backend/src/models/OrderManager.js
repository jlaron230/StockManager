const AbstractManager = require("./AbstractManager");

class OrderManager extends AbstractManager {
  constructor() {
    super({ table: "`order`" }); // Table protégée par backticks car "order" est un mot réservé SQL
  }

  // Insère une nouvelle commande
  insert(order) {
    return this.database
        .query(
            `INSERT INTO ${this.table} (date_commande, statut, total_ammount, id_user, id_provider)
             VALUES (?, ?, ?, ?, ?)`,
            [order.date_commande, order.statut, order.total_ammount, order.id_user, order.id_provider]
        )
        .then(([result]) => ({ insertId: result.insertId }));
  }

  // Récupère une commande par son id
  read(id) {
    return this.database.query(
        `SELECT * FROM ${this.table} WHERE id_order = ?`,
        [id]
    );
  }

  // Met à jour une commande existante
  update(id_order, order) {
    return this.database.query(
        `UPDATE ${this.table} SET date_commande = ?, statut = ?, id_user = ?, id_provider = ?, is_validated = ?
         WHERE id_order = ?`,
        [order.date_commande, order.statut, order.id_user, order.id_provider, order.is_validated, id_order]
    );
  }

  // Récupère toutes les commandes
  readAll() {
    return this.database.query(
        `SELECT * FROM ${this.table}`
    );
  }

  // Récupère détails (produits et prix unitaires) pour les commandes
  readTotals() {
    return this.database.query(
        `SELECT
           op.id_order,
           op.id_product,
           op.quantity,
           p.price AS unit_price
         FROM ${this.table} AS op
                JOIN product AS p ON op.id_product = p.id_product`
    );
  }

  // Récupère le statut d’une commande
  readStatus(id) {
    return this.database.query(
        `SELECT statut FROM ${this.table} WHERE id_order = ?`,
        [id]
    );
  }

  // Supprime une commande par son id
  delete(id) {
    return this.database.query(
        `DELETE FROM ${this.table} WHERE id_order = ?`,
        [id]
    );
  }

  // Met à jour le montant total d’une commande
  updateTotal(id_order, total) {
    return this.database.query(
        `UPDATE ${this.table} SET total_ammount = ? WHERE id_order = ?`,
        [total, id_order]
    );
  }
}

module.exports = OrderManager;
