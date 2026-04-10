const tables = require("../models");

// Récupère tous les magasins
const browse = async (req, res) => {
    try {
        const [rows] = await tables.store.readAll();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Erreur serveur
    }
}

// Récupère un magasin par son ID
const read = async (req, res) => {
    try {
        const [rows] = await tables.store.read(req.params.id);
        if (rows.length === 0) {
            res.sendStatus(404); // Non trouvé
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500); // Erreur serveur
    }
};

module.exports = {
    browse,
    read,
}
