// On importe la configuration Firebase Admin (côté serveur)
const admin = require("./backend/config/firebase");

// ✅ Vérification que Firebase Cloud Messaging (FCM) est bien initialisé
console.log("🧪 Vérification FCM...");

// Affiche le type de retour de la fonction admin.messaging()
// Cela permet de vérifier que FCM est bien utilisable (doit être un objet)
console.log("Type admin.messaging:", typeof admin.messaging);

// Affiche toutes les fonctions disponibles sur l'objet FCM (ex: send, sendMulticast, etc.)
console.log("Fonctions disponibles:", Object.keys(admin.messaging()));
