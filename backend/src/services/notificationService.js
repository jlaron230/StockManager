const admin = require("../../config/firebase"); // Importe l'instance Firebase initialisée

// Fonction pour envoyer des notifications à plusieurs tokens via Firebase Cloud Messaging
const sendNotification = async (tokens, title, body) => {
  try {
    const responses = []; // Stocke les réponses de FCM

    for (const token of tokens) {
      // Prépare le message à envoyer
      const message = {
        notification: { title, body }, // Contenu de la notification
        token, // Token de l'appareil destinataire
      };

      // Envoie la notification via Firebase
      const response = await admin.messaging().send(message);
      responses.push(response); // Stocke la réponse
    }

    // Affiche le nombre de notifications envoyées avec succès
    console.log("✅ Notifications envoyées :", responses.length);
    return responses;
  } catch (err) {
    // En cas d'erreur lors de l'envoi, log l'erreur
    console.error("❌ Erreur FCM :", err);
    throw err;
  }
};

// Exporte la fonction pour l'utiliser ailleurs
module.exports = { sendNotification };
