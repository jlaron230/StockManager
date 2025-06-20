require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env
const mysql = require("mysql2/promise"); // Import du module mysql2 avec support des promesses

(async () => {
  try {
    // Création de la connexion à la base de données avec les infos du .env
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("✅ Connexion à la base réussie !");
    await connection.end(); // Fermeture de la connexion
  } catch (err) {
    console.error("❌ Erreur de connexion :", err.message); // Affiche l'erreur en cas de problème
  }
})();
