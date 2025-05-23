const AbstractManager = require("./AbstractManager");

class NotificationManager extends AbstractManager {
  constructor() {
    super({ table: "notification" });
  }

  // Vérifie si une notification a déjà été envoyée pour ce produit aujourd’hui
  checkIfAlreadySentToday(productId) {
    return this.database.query(
      `SELECT np.id_product 
       FROM notification_product np
       JOIN notification n ON np.id_notification = n.id_notification
       WHERE np.id_product = ? AND DATE(n.date_notification) = CURDATE()`,
      [productId]
    );
  }

  // Crée une nouvelle notification (nommé insert pour cohérence)
  insert({ message, type }) {
    return this.database.query(
      `INSERT INTO notification (message, date_notification, type)
       VALUES (?, NOW(), ?)`,
      [message, type]
    );
  }

  // Lie un produit à une notification
  linkProductToNotification(notificationId, productId) {
    return this.database.query(
      `INSERT INTO notification_product (id_notification, id_product)
       VALUES (?, ?)`,
      [notificationId, productId]
    );
  }
}

module.exports = NotificationManager;
