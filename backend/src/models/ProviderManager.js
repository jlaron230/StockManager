const AbstractManager = require("./AbstractManager");

class ProviderManager extends AbstractManager {
    constructor() {
        super({ table: "provider" });
    }

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

    readAll() {
        return this.database.query(
            `SELECT * FROM ${this.table}`
        );
    }

    read(id) {
        return this.database.query(
            `SELECT * FROM ${this.table} WHERE id_provider = ?`,
            [id]
        );
    }

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
