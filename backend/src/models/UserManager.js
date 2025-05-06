const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
    constructor() {
        super({ table: "users" });
    }

    insert(users) {
        return this.database.query(
            `INSERT INTO ${this.table} (prenom, nom, telephone, email, password, entreprise, pays, adresse, ville, postal)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                users.prenom,
                users.nom,
                users.telephone,
                users.email,
                users.password,
                users.entreprise,
                users.pays,
                users.adresse,
                users.ville,
                users.postal,
            ]
        );
    }

    findById(id) {
        return this.database.query(
            `SELECT id_user, nom, prenom, email, role, entreprise, pays, adresse, ville, postal, telephone
             FROM ${this.table} WHERE id_user = ?`,
            [id]
        );
    }
    
    updateProfile(id, data) {
        return this.database.query(
            `UPDATE ${this.table}
             SET nom = ?, prenom = ?, email = ?, entreprise = ?, pays = ?, adresse = ?, ville = ?, postal = ?, telephone = ?
             WHERE id_user = ?`,
            [
                data.nom,
                data.prenom,
                data.email,
                data.entreprise,
                data.pays,
                data.adresse,
                data.ville,
                data.postal,
                data.telephone,
                id
            ]
        );
    }
    
}

module.exports = UserManager;
