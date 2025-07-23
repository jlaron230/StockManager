const { body, param } = require("express-validator");

const validateCategoryCreation = [
    body("name")
        .trim()
        .notEmpty().withMessage("Le nom de la catégorie est obligatoire.")
        .isLength({ max: 100 }).withMessage("Le nom ne doit pas dépasser 100 caractères."),
];

const validateCategoryUpdate = [
    param("id").isInt({ gt: 0 }).withMessage("L'ID doit être un entier positif."),
    ...validateCategoryCreation, // même règles que pour la création
];

const validateCategoryIdParam = [
    param("id").isInt({ gt: 0 }).withMessage("L'ID doit être un entier positif."),
];

module.exports = {
    validateCategoryCreation,
    validateCategoryUpdate,
    validateCategoryIdParam,
};
