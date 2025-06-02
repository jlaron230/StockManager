const tables = require("../models");

const browse = async (req, res) => {
    try {
        const [rows] = await tables.store.readAll();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

const read = async (req, res) => {
    try {
        const [rows] = await tables.store.read(req.params.id);
        if (rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};


module.exports = {
    browse,
    read,
}