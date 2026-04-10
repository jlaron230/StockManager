const { body } = require("express-validator");

const providerValidationRules = [
    body("nom")
        .notEmpty().withMessage("Le nom est requis.")
        .isLength({ max: 100 }).withMessage("Le nom ne doit pas dépasser 100 caractères."),

    body("adresse")
        .optional({ nullable: true })
        .isLength({ max: 255 }).withMessage("L'adresse ne doit pas dépasser 255 caractères."),

    body("téléphone")
        .optional({ nullable: true })
        .matches(/^[0-9\s+()-]*$/).withMessage("Le téléphone contient des caractères invalides.")
        .isLength({ max: 20 }).withMessage("Le téléphone ne doit pas dépasser 20 caractères."),

    body("email")
        .optional({ nullable: true })
        .isEmail().withMessage("Email invalide.")
        .isLength({ max: 255 }).withMessage("L'email ne doit pas dépasser 255 caractères."),

];

module.exports = providerValidationRules;