// Importation de la bibliothèque bcrypt pour le hachage et la vérification de mots de passe
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
// Définition du nombre de "rounds" de sel utilisé pour le hashage (sécurité)
const SALT_ROUNDS = 10;

// Middleware pour hasher le mot de passe de l'utilisateur avant de le stocker en base de données
const hashPassword = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, SALT_ROUNDS); // Hash du mot de passe
        next(); // Poursuit l'exécution des middlewares suivants
    } catch (err) {
        console.error("Erreur lors du hashage du mot de passe :", err);
        res.sendStatus(500); // Erreur serveur si le hash échoue
    }
};

// Middleware pour vérifier le mot de passe lors de la connexion utilisateur
const verifyPassword = async (req, res, next) => {
    try {
        const isPasswordValid = await bcrypt.compare(req.body.password, req.user.password); // Vérifie la correspondance

        if (isPasswordValid) {
            console.log("Password verification succeeded");

            // Si le mot de passe est correct, on stocke les infos utiles en session
            req.session.user = {
                id: req.user.id_user,
                email: req.user.email,
                role: req.user.role,
                nom: req.user.nom,
            };

            // Supprime le mot de passe de la réponse envoyée au client pour des raisons de sécurité
            delete req.user.password;

            return res.status(200).json(req.user); // Retourne les infos utilisateur
        } else {
            res.sendStatus(401); // Accès non autorisé si mot de passe invalide
        }
    } catch (err) {
        console.error('Error verifying password:', err);
        res.sendStatus(500); // Erreur serveur lors de la vérification
    }
};

// Middleware de protection des routes : vérifie que l'utilisateur est connecté (session active)
const requireLogin = (req, res, next) => {
    console.log(req.session?.user);
    console.log("USER:", req.session);
    if (!req.session?.user) {
        return res.status(401).json({ message: "Non autorisé : veuillez vous connecter." });
    }
    next(); // L'utilisateur est connecté, on continue
};

// Middleware de protection des routes admin : vérifie que l'utilisateur connecté est un administrateur
const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).json({ message: "Accès refusé : administrateur uniquement." });
    }
    next(); // L'utilisateur est admin, on continue
};

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Exportation des middlewares pour pouvoir les utiliser dans d'autres fichiers
module.exports = {
    hashPassword,
    requireLogin,
    verifyPassword,
    requireAdmin,
   handleValidationErrors,
};
