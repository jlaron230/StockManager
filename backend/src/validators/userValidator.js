const { body } = require('express-validator');

const validateUserProfile = [
    body('email')
        .isEmail()
        .withMessage("L'email est invalide"),
    body('firstname')
        .trim()
        .notEmpty()
        .withMessage('Le prénom est requis'),
    body('lastname')
        .trim()
        .notEmpty()
        .withMessage('Le nom est requis'),
    // Ajoute d'autres champs si besoin
];

module.exports = { validateUserProfile };
