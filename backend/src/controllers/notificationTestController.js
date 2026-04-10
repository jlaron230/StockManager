const { sendNotification } = require("../services/notificationService");

// Test d'envoi de notification push
const testNotif = async (req, res) => {
  const { token } = req.body;

  // Vérifie si le token FCM est fourni
  if (!token) {
    return res.status(400).json({ message: "Token FCM manquant" });
  }

  try {
    // Envoie la notification au token reçu (dans un tableau)
    await sendNotification(
        [token],
        "📣 Etat critique",
        "LE produit'gateaux' est bientôt en rupture de stock."
    );

    // Réponse succès
    res.status(200).json({ message: "Notification envoyée avec succès" });
  } catch (err) {
    console.error("Erreur envoi testNotif :", err);
    res.sendStatus(500);
  }
};

module.exports = { testNotif };
