const AbstractManager = require("./AbstractManager");

class Notification_productManager extends AbstractManager {
  constructor() {
    super({ table: "notification_product" }); // Définit la table de liaison notification_product
  }

  // Insère un lien entre une notification et un produit
  insert({ id_notification, id_product }) {
    return this.database.query(
        `INSERT INTO notification_product (id_notification, id_product)
         VALUES (?, ?)`,
        [id_notification, id_product]
    );
  }
}

module.exports = Notification_productManager;
