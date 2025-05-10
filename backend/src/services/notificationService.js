const admin = require("../../config/firebase");

const sendNotification = async (tokens, title, body) => {
  const message = {
    notification: { title, body },
    tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("🔔 Notifications envoyées :", response.successCount);
    return response;
  } catch (err) {
    console.error("❌ Erreur FCM :", err);
    throw err;
  }
};

module.exports = { sendNotification };
