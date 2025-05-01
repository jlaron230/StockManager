const client = require("../database/client");

async function addResetColumns() {
  try {
    await client.query(`
      ALTER TABLE users
      ADD COLUMN reset_token VARCHAR(255),
      ADD COLUMN reset_token_expire DATETIME;
    `);

    console.log("✅ Colonnes 'reset_token' et 'reset_token_expire' ajoutées avec succès.");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des colonnes :", error);
    process.exit(1);
  }
}

addResetColumns();
