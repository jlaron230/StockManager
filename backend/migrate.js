// Charge les variables d'environnement depuis le fichier .env
require("dotenv").config();

// Importe les modules nécessaires
const fs = require("fs");
const mysql = require("mysql2/promise");

// Fonction principale pour migrer la base de données
const migrate = async () => {
  // Récupère les infos de connexion à la base depuis le fichier .env
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  // Crée une connexion à MySQL
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true, // permet d'exécuter plusieurs requêtes SQL à la fois
  });

  // Supprime la base de données si elle existe
  await connection.query(`drop database if exists ${DB_NAME}`);

  // Crée une nouvelle base de données
  await connection.query(`create database ${DB_NAME}`);

  // Utilise cette base de données pour les prochaines requêtes
  await connection.query(`use ${DB_NAME}`);

  // Lit le contenu du fichier SQL contenant les instructions de création
  const sql = fs.readFileSync("./database.sql", "utf8");

  // Exécute les requêtes SQL lues dans le fichier
  await connection.query(sql);

  // Ferme la connexion à MySQL
  connection.end();
};

// Lance la migration et affiche les erreurs s'il y en a
try {
  migrate();
} catch (err) {
  console.error(err);
}

