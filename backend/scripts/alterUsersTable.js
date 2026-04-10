const client = require("../database/client"); // Import du client pour interagir avec la base de données

// Fonction pour ajouter deux colonnes nécessaires à la gestion du reset de mot de passe
async function addResetColumns() {
  try {
    // Requête SQL pour ajouter les colonnes 'reset_token' et 'reset_token_expire' dans la table users
    await client.query(`
      ALTER TABLE users
      ADD COLUMN reset_token VARCHAR(255),
      ADD COLUMN reset_token_expire DATETIME;
    `);

    console.log("✅ Colonnes 'reset_token' et 'reset_token_expire' ajoutées avec succès.");
    process.exit(); // Quitte le processus avec succès
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des colonnes :", error);
    process.exit(1); // Quitte le processus avec une erreur
  }
}

addResetColumns(); // Appelle la fonction pour effectuer la modification de la table
