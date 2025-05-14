const cron = require("node-cron");
const tables = require("../models");
const { sendNotification } = require("../services/notificationService");

// Fonction principale qui vérifie les stocks bas et envoie une notification
const checkLowStockAndNotify = async () => {
  try {
    const [lowStockProducts] = await tables.stock.getLowStockProducts();

    if (lowStockProducts.length === 0) return;

    // Générer le message
    const productNames = lowStockProducts.map((p) => p.nom).join(", ");
    const message = `Stock critique pour : ${productNames}`;

    // Vérifier si une notification identique a déjà été envoyée aujourd'hui
    const [alreadySent] = await tables.notification.checkIfAlreadySentToday(message);
    
    if (alreadySent.length > 0) return;


    // Créer une nouvelle notification
    const [notifResult] = await tables.notification.insert({
      message,
      statut: "envoyé",
      type: "stock",
    });
    const id_notification = notifResult.insertId;

    // Lier les produits concernés
    const linkPromises = lowStockProducts.map((p) =>
      tables.notification_product.insert({
        id_notification,
        id_product: p.id_product,
      })
    );
    await Promise.all(linkPromises);

    // Récupérer tous les tokens
    const [users] = await tables.user.getAllWithFcmToken();
    const tokens = users.map((u) => u.fcm_token);

    if (tokens.length > 0) {
      await sendNotification(tokens, "📦 Alerte stock", message);
    }
  } catch (err) {
    console.error("Erreur tâche stock critique:", err);
  }
};

// Tâche planifiée tous les jours à 9h00
cron.schedule("0 9 * * *", () => {
  console.log("🕘 Tâche stock critique lancée");
  checkLowStockAndNotify();
});

module.exports = checkLowStockAndNotify;
