const AbstractManager = require("./AbstractManager");

class NotificationManager extends AbstractManager {
  constructor() {
    super({ table: "notification" }); // Définit la table associée aux notifications
  }

  // Vérifie si une notification a déjà été envoyée aujourd'hui pour un produit donné
  checkIfAlreadySentToday(productId) {
    return this.database.query(
        `SELECT np.id_product
         FROM notification_product np
                JOIN notification n ON np.id_notification = n.id_notification
         WHERE np.id_product = ? AND DATE(n.date_notification) = CURDATE()`,
        [productId]
    );
  }

  // Crée une nouvelle notification avec un message et un type
  insert({ message, type }) {
    return this.database.query(
        `INSERT INTO notification (message, date_notification, type)
         VALUES (?, NOW(), ?)`,
        [message, type]
    );
  }

  // Associe un produit à une notification dans la table de liaison
  linkProductToNotification(notificationId, productId) {
    return this.database.query(
        `INSERT INTO notification_product (id_notification, id_product)
         VALUES (?, ?)`,
        [notificationId, productId]
    );
  }
}

module.exports = NotificationManager;
