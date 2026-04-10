class AbstractManager {
  constructor({ table }) {
    this.table = table; // Définit la table SQL sur laquelle ce manager opère
  }

  // Recherche un enregistrement par son ID
  find(id) {
    return this.database.query(`select * from  ${this.table} where id = ?`, [
      id,
    ]);
  }

  // Récupère tous les enregistrements de la table
  findAll() {
    return this.database.query(`select * from  ${this.table}`);
  }

  // Supprime un enregistrement par son ID
  delete(id) {
    return this.database.query(`delete from ${this.table} where id = ?`, [id]);
  }

  // Assigne l'objet de connexion à la base de données
  setDatabase(database) {
    this.database = database;
  }
}

module.exports = AbstractManager;
