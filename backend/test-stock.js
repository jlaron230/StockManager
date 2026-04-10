// Importe la fonction qui vérifie les stocks faibles et envoie une alerte si nécessaire.
// Cette fonction se trouve dans le fichier 'stockAlertCron.js' dans le dossier 'src/cron'.
const checkLowStockAndNotify = require("./src/cron/stockAlertCron");

// Exécute immédiatement la fonction pour vérifier les stocks faibles au démarrage du script.
// Cela permet de lancer le processus de vérification dès que ce fichier est appelé.
checkLowStockAndNotify();
