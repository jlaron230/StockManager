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

      // Vérifie si une notif identique a déjà été envoyée aujourd'hui
      const [alreadySent] = await tables.notification.checkIfAlreadySentToday(message);
      if (alreadySent.length > 0) return;

      // Crée une nouvelle notification
      const [notifResult] = await tables.notification.insert({
        message,
        statut: "envoyé",
        type: "stock",
      });
      const id_notification = notifResult.insertId;

      // Lie les produits concernés
      const linkPromises = lowStockProducts.map((p) =>
        tables.notification_product.insert({
          id_notification,
          id_product: p.id_product,
        })
      );
      await Promise.all(linkPromises);

      // 🔥 Récupérer tous les tokens web ET mobile
      const [users] = await tables.user.getAllWithFcmToken(); 
      const allTokens = [
        ...users.filter((u) => u.fcm_token).map((u) => u.fcm_token),
        ...users.filter((u) => u.fcm_token_mobil).map((u) => u.fcm_token_mobil),
      ];

      console.log("📱 Tokens trouvés :", allTokens);

      if (allTokens.length > 0) {
        await sendNotification(allTokens, "📦 Alerte stock", message);
      }
    } catch (err) {
      console.error("❌ Erreur tâche stock critique:", err);
    }
  };

  // 🕒 Planification tous les jours à 16h30
  cron.schedule("30 16 * * *", () => {
    console.log("🕟 Tâche stock critique lancée");
    checkLowStockAndNotify();
  });

  module.exports = checkLowStockAndNotify;
