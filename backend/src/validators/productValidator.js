const { body } = require('express-validator');

const validateProduct = [
// Validation pour la création d’un produit
    body("nom")
        .trim()
        .notEmpty().withMessage("Le nom est requis."),
    body("description")
        .optional()
        .isString().withMessage("La description doit être une chaîne de caractères."),
    body("prix_unitaire")
        .isFloat({ min: 0 }).withMessage("Le prix unitaire doit être un nombre positif."),
    body("quantité_en_stock")
        .isInt({ min: 0 }).withMessage("La quantité en stock doit être un entier positif."),
    body("seuil_minimal")
        .isInt({ min: 0 }).withMessage("Le seuil minimal doit être un entier positif."),
    body("id_category")
        .isInt({ min: 1 }).withMessage("L'ID de catégorie est requis et doit être un entier."),
    body("id_provider")
        .isInt({ min: 1 }).withMessage("L'ID du fournisseur est requis et doit être un entier."),
    body("storeIds")
        .optional()
        .isArray().withMessage("storeIds doit être un tableau d'IDs de magasins."),
];

// Validation pour la mise à jour complète (PUT)
const validateProductEdit = [
    body("nom")
        .trim()
        .notEmpty().withMessage("Le nom est requis."),
    body("description")
        .optional()
        .isString().withMessage("La description doit être une chaîne de caractères."),
    body("prix_unitaire")
        .isFloat({ min: 0 }).withMessage("Le prix unitaire doit être un nombre positif."),
    body("quantité_en_stock")
        .isInt({ min: 0 }).withMessage("La quantité en stock doit être un entier positif."),
    body("seuil_minimal")
        .isInt({ min: 0 }).withMessage("Le seuil minimal doit être un entier positif."),
    body("id_category")
        .isInt({ min: 1 }).withMessage("L'ID de catégorie est requis."),
    body("id_provider")
        .isInt({ min: 1 }).withMessage("L'ID du fournisseur est requis."),
];

// Validation pour la mise à jour partielle (PATCH)
const validateProductPartialUpdate = [
    body("nom")
        .optional()
        .notEmpty().withMessage("Le nom ne peut pas être vide."),
    body("description")
        .optional()
        .isString().withMessage("La description doit être une chaîne de caractères."),
    body("prix_unitaire")
        .optional()
        .isFloat({ min: 0 }).withMessage("Le prix unitaire doit être un nombre positif."),
    body("quantité_en_stock")
        .optional()
        .isInt({ min: 0 }).withMessage("La quantité en stock doit être un entier positif."),
    body("seuil_minimal")
        .optional()
        .isInt({ min: 0 }).withMessage("Le seuil minimal doit être un entier positif."),
    body("id_category")
        .optional()
        .isInt({ min: 1 }).withMessage("L'ID de catégorie doit être un entier."),
];

module.exports = {
    validateProduct,
    validateProductEdit,
    validateProductPartialUpdate,
};
