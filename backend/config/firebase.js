const admin = require("firebase-admin"); // Import du SDK Firebase Admin
const serviceAccount = require("./firebaseKey.json"); // Import des clés de service Firebase

// Initialisation de l'application Firebase Admin avec les identifiants de service
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin; // Export de l'instance Firebase Admin pour utilisation dans d'autres fichiers
