const nodemailer = require("nodemailer"); // Importe le module Nodemailer pour l'envoi d'e-mails

// Crée un transporteur SMTP en utilisant Gmail comme service d'envoi
const transporter = nodemailer.createTransport({
  service: "gmail", // Utilise le service Gmail
  auth: {
    user: process.env.EMAIL_USER, // Adresse e-mail utilisée pour l'envoi (définie dans .env)
    pass: process.env.EMAIL_PASS, // Mot de passe ou mot de passe d'application Gmail
  },
});

// Exporte le transporteur pour pouvoir l'utiliser ailleurs dans l'application
module.exports = transporter;
