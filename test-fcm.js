const admin = require("./backend/config/firebase");

console.log("🧪 Vérification FCM...");
console.log("Type admin.messaging:", typeof admin.messaging);
console.log("Fonctions disponibles:", Object.keys(admin.messaging()));
