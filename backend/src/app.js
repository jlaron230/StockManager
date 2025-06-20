require("dotenv").config(); // Charge les variables d'environnement depuis le fichier .env

// Importe des modules Node.js pour le système de fichiers et les chemins
const fs = require("node:fs");
const path = require("node:path");

// Importe express et initialise l'application
const express = require("express");
const app = express();

// Importe le module de gestion de session
const session = require("express-session");

// Importe la configuration Swagger pour la documentation API
const { swaggerUi, swaggerDocs } = require("../swaggerConfig");

// Active le parsing JSON des requêtes
app.use(express.json());

// Importe et configure CORS pour permettre les requêtes cross-origin depuis le frontend
const cors = require("cors");
app.use(
    cors({
        origin: process.env.FRONTEND_URL ?? "http://localhost:5173", // Autorise le frontend
        optionsSuccessStatus: 200,
        credentials: true, // Autorise les cookies de session
    })
);

app.use(express.json()); // Active le parsing JSON (déjà fait plus haut, redondant)

// Configuration de la session (stockée côté serveur)
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Clé secrète pour signer les cookies
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,       // Empêche l'accès JS côté client
            secure: false,        // Doit être true en production avec HTTPS
            sameSite: "lax",      // Protection contre CSRF
            maxAge: 1000 * 60 * 60 * 24, // Expiration : 1 jour
        },
    })
);

// Importe et monte les routes de l'API
const router = require("./router");
app.use(router);

// Monte la documentation Swagger à l'URL /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Sert les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, "../public")));

// Chemin vers le fichier index.html du frontend (build React)
const reactIndexFile = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "dist",
    "index.html"
);

// Si le build React existe, on le sert comme site statique
if (fs.existsSync(reactIndexFile)) {
    app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

    // Toutes les routes (non API) redirigent vers l'app React
    app.get("*", (req, res) => {
        res.sendFile(reactIndexFile);
    });
}

// Exporte l'application pour qu'elle puisse être utilisée dans server.js
module.exports = app;
