const AbstractManager = require("./AbstractManager");

// Classe StoreManager hérite d'AbstractManager pour gérer la table "store"
class StoreManager extends AbstractManager {
    constructor() {
        super({ table: "store" }); // Initialise la table "store"
    }

    // Récupère tous les enregistrements dans la table "store"
    readAll() {
        return this.database.query(
            `SELECT * FROM ${this.table}`
        );
    }

    // Récupère un enregistrement spécifique par son id_store
    read(id) {
        return this.database.query(
            `SELECT * FROM ${this.table} WHERE id_store = ?`,
            [id]
        );
    }
}

module.exports = StoreManager;
