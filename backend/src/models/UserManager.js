const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
    constructor() {
        super({ table: "users" }); // Initialise la table "users"
    }

    // Ajoute un nouvel utilisateur en base de données
    insert(users) {
        return this.database.query(
            `INSERT INTO ${this.table} (prenom, nom, telephone, email, password, entreprise, pays, adresse, ville, postal, role)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                users.role,
            ]
        );
    }

    // Recherche un utilisateur par son email (utilisé pour l'authentification)
    async findUserByEmail(email) {
        console.log("Recherche utilisateur avec l'email :", email);
        const [rows] = await this.database.query(
            `SELECT * FROM ${this.table} WHERE email = ?`,
            [email]
        );
        console.log("Résultat de la requête :", rows);
        return rows;
    }

    // Récupère un utilisateur par son ID
    findById(id) {
        return this.database.query(
            `SELECT id_user, nom, prenom, email, role, entreprise, pays, adresse, ville, postal, telephone
             FROM ${this.table} WHERE id_user = ?`,
            [id]
        );
    }

    // Met à jour les informations de profil d’un utilisateur
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

    // Met à jour le token FCM (notification web)
    updateFcmToken(id_user, token) {
        return this.database.query(
            `UPDATE ${this.table} SET fcm_token = ? WHERE id_user = ?`,
            [token, id_user]
        );
    }

    // Met à jour le token FCM mobile (notification mobile)
    updateTokenMobil(id_user, token) {
        return this.database.query(
            `UPDATE ${this.table} SET fcm_token_mobil = ? WHERE id_user = ?`,
            [token, id_user]
        );
    }

    // Récupère tous les utilisateurs ayant un token FCM (web ou mobile)
    getAllWithFcmToken() {
        return this.database.query(`
            SELECT id_user, fcm_token, fcm_token_mobil
            FROM users
            WHERE fcm_token IS NOT NULL OR fcm_token_mobil IS NOT NULL
        `);
    }

    // Récupère tous les utilisateurs (pour l’admin par exemple)
    findAll() {
        return this.database.query(
            `SELECT id_user, nom, prenom, email, role
             FROM ${this.table}`
        );
    }

    // Supprime un utilisateur par ID
    delete(id) {
        return this.database.query(`DELETE FROM ${this.table} WHERE id_user = ?`, [id]);
    }

    // Mise à jour générique d’un utilisateur (champ dynamique)
    updateUser(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);

        if (keys.length === 0) {
            throw new Error("Aucune donnée à mettre à jour");
        }

        const setClause = keys.map((key) => `${key} = ?`).join(", ");

        return this.database.query(
            `UPDATE ${this.table} SET ${setClause} WHERE id_user = ?`,
            [...values, id]
        );
    }

    // Création d’un utilisateur minimaliste (ex: pour une invite rapide)
    create(user) {
        return this.database.query(
            `INSERT INTO ${this.table} (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)`,
            [user.nom, user.prenom, user.email, user.password, user.role]
        );
    }
}

module.exports = UserManager;
