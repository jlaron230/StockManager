const { sendNotification } = require("../services/notificationService");

const testNotif = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token FCM manquant" });
  }

  try {
    // Envoie du token unique dans un tableau
    await sendNotification(
      [token], // on l’envoie sous forme de tableau pour correspondre à la fonction
      "📣 Etat critique",
      "LE produit'gateaux' est bientôt en rupture de stock."
    );

    res.status(200).json({ message: "Notification envoyée avec succès" });
  } catch (err) {
    console.error("Erreur envoi testNotif :", err);
    res.sendStatus(500);
  }
};

module.exports = { testNotif };
