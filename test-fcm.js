const admin = require("./backend/config/firebase");

//test notif cd backend
//node test-stock.js

console.log("🧪 Vérification FCM...");
console.log("Type admin.messaging:", typeof admin.messaging);
console.log("Fonctions disponibles:", Object.keys(admin.messaging()));
