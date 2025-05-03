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
}

module.exports = UserManager;
