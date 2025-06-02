const AbstractManager = require("./AbstractManager");

class StoreManager extends AbstractManager {
    constructor() {
        super({ table: "store" });
    }

    readAll() {
        return this.database.query(
            `SELECT * FROM ${this.table}`
        );
    }

    read(id) {
        return this.database.query(
            `SELECT * FROM ${this.table} WHERE id_store = ?`,
            [id]
        );
    }

}


module.exports = StoreManager;