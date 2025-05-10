const admin = require("../../config/firebase");

const sendNotification = async (tokens, title, body) => {
  try {
    const responses = [];

    for (const token of tokens) {
      const message = {
        notification: { title, body },
        token, // attention ici, c'est `token` et non `tokens`
      };

      const response = await admin.messaging().send(message);
      responses.push(response);
    }

    console.log("✅ Notifications envoyées :", responses.length);
    return responses;
  } catch (err) {
    console.error("❌ Erreur FCM :", err);
    throw err;
  }
};

module.exports = { sendNotification };
