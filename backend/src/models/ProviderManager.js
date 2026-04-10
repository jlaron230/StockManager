const AbstractManager = require("./AbstractManager");

// Classe ProviderManager pour gérer la table "provider"
class ProviderManager extends AbstractManager {
    constructor() {
        super({ table: "provider" }); // Initialise la table "provider"
    }

    // Insère un nouveau fournisseur dans la base de données
    insert(provider) {
        return this.database.query(
            `INSERT INTO ${this.table}
             (nom, email, telephone, type, id_admin, adresse, code_postal, commentaire)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                provider.nom,
                provider.email,
                provider.telephone,
                provider.type,
                provider.id_admin,
                provider.adresse,
                provider.code_postal,
                provider.commentaire,
            ]
        );
    }

    // Met à jour un fournisseur existant par son id
    update(id, provider) {
        return this.database.query(
            `UPDATE ${this.table} SET
                                      nom = ?, email = ?, telephone = ?, type = ?, id_admin = ?, adresse = ?, code_postal = ?, commentaire = ?
             WHERE id_provider = ?`,
            [
                provider.nom,
                provider.email,
                provider.telephone,
                provider.type,
                provider.id_admin,
                provider.adresse,
                provider.code_postal,
                provider.commentaire,
                id,
            ]
        );
    }

    // Récupère tous les fournisseurs
    readAll() {
        return this.database.query(
            `SELECT * FROM ${this.table}`
        );
    }

    // Récupère un fournisseur spécifique par son id
    read(id) {
        return this.database.query(
            `SELECT * FROM ${this.table} WHERE id_provider = ?`,
            [id]
        );
    }

    // Montre la structure de la colonne 'type' dans la table
    show() {
        return this.database.query(
            `SHOW COLUMNS FROM ${this.table} LIKE 'type'`
        );
    }

    // Supprime un fournisseur par son id
    delete(id) {
        return this.database.query(
            `DELETE FROM ${this.table} WHERE id_provider = ?`,
            [id]
        );
    }

    // Méthodes liées à category supprimées :
    // - findByCategoryId()
    // - findCategoryId()
}

module.exports = ProviderManager;
