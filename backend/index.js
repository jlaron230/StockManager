// Charge les variables d'environnement depuis le fichier .env
require("dotenv").config();

// Lance la tâche planifiée pour surveiller les stocks
require("./src/cron/stockAlertCron");

// Importe l'application Express (API backend)
const app = require("./src/app");

// Définit le port sur lequel le serveur va écouter (par défaut : 5000)
const port = parseInt(process.env.APP_PORT ?? "5000", 10);

// Démarre le serveur
app.listen(port, (err) => {
  if (err) {
    // Affiche une erreur si le serveur échoue au démarrage
    console.error("Something bad happened");
  } else {
    // Confirme que le serveur fonctionne et affiche le port utilisé
    console.log(`Server is listening on ${port}`);
  }
});

