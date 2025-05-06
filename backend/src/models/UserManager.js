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

    findUserByEmail(email) {
        return this.database.query(
            `SELECT * FROM ${this.table} WHERE email = ? `,
            [email]
        );
    }

    findById(id) {
        // Execute an SQL query to select all fields from the table for the user with the specified ID
        return this.database.query(
            `SELECT * FROM ${this.table} WHERE id = ?`,
            [id]
        ).then(results => results[0]);
    }
}

module.exports = UserManager;
