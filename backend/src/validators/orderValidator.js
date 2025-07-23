const { body } = require("express-validator");

const orderValidator = [
    body("id_provider")
        .notEmpty().withMessage("Le fournisseur est requis.")
        .isInt({ min: 1 }).withMessage("L'identifiant du fournisseur doit être un entier positif."),

    body("statut")
        .optional()
        .isIn(["en cours", "terminée"]).withMessage("Le statut doit être 'en cours' ou 'terminée'."),

    body("products")
        .isArray({ min: 1 }).withMessage("Au moins un produit est requis.")
        .custom((products) => {
            for (const p of products) {
                if (typeof p.id_product !== "number" || p.id_product <= 0) {
                    throw new Error("Chaque produit doit avoir un id_product entier positif.");
                }
                if (typeof p.quantité !== "number" || p.quantité < 0) {
                    throw new Error("Chaque produit doit avoir une quantité valide (≥ 0).");
                }
            }
            return true;
        }),
];

module.exports = orderValidator;