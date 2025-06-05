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

    async findUserByEmail(email) {
        console.log("Recherche utilisateur avec l'email :", email);
        const [rows] = await this.database.query(
            `SELECT * FROM ${this.table} WHERE email = ?`,
            [email]
        );
        console.log("Résultat de la requête :", rows);
        return rows;
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

    updateFcmToken(id_user, token) {
           return this.database.query(
          `UPDATE ${this.table} SET fcm_token = ? WHERE id_user = ?`,
          [token, id_user]
        );
    }


     updateTokenMobil(id_user, token) {
        return this.database.query(
        `UPDATE ${this.table} SET fcm_token_mobil = ? WHERE id_user = ?`,
        [token, id_user]
        );
    } 


        getAllWithFcmToken() {
        return this.database.query(
         `SELECT id_user, fcm_token FROM ${this.table}
          WHERE fcm_token IS NOT NULL AND fcm_token != ''`
        );
    }


    findAll() {
        return this.database.query(
            `SELECT id_user, nom, prenom, email, role
             FROM ${this.table}`
        );  
    }

    delete(id) {
        return this.database.query(`DELETE FROM ${this.table} WHERE id_user = ?`, [id]);
    }

    update(id, data) {
        return this.database.query(
        `UPDATE ${this.table} SET nom = ?, prenom = ?, email = ?, role = ?, entreprise = ?, pays = ?, adresse = ?, telephone = ? WHERE id_user = ?`,
        [data.nom, data.prenom, data.email, data.role, data.entreprise, data.pays, data.adresse, data.telephone, id]
        );
    }

    create(user) {
        return this.database.query(
        `INSERT INTO ${this.table} (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)`,
        [user.nom, user.prenom, user.email, user.password, user.role]
        );
    }

    getAllWithFcmToken() {
        return this.database.query(`
        SELECT id_user, fcm_token, fcm_token_mobil
        FROM user
        WHERE fcm_token IS NOT NULL OR fcm_token_mobil IS NOT NULL
        `);
    }


}

module.exports = UserManager;
