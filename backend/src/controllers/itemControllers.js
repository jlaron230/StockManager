const models = require("../models");

// Récupère tous les items
const browse = (req, res) => {
    models.item
        .findAll()
        .then(([rows]) => {
            res.send(rows);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

// Récupère un item par son id
const read = (req, res) => {
    models.item
        .find(req.params.id)
        .then(([rows]) => {
            if (rows[0] == null) {
                res.sendStatus(404); // Item non trouvé
            } else {
                res.send(rows[0]); // Envoie l'item trouvé
            }
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

// Modifie un item existant
const edit = (req, res) => {
    const item = req.body;

    // TODO validations (length, format...)

    item.id = parseInt(req.params.id, 10);

    models.item
        .update(item)
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.sendStatus(404); // Item non trouvé
            } else {
                res.sendStatus(204); // Modification réussie, pas de contenu
            }
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

// Ajoute un nouvel item
const add = (req, res) => {
    const item = req.body;

    // TODO validations (length, format...)

    models.item
        .insert(item)
        .then(([result]) => {
            res.location(`/items/${result.insertId}`).sendStatus(201); // Créé avec succès
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

// Supprime un item par son id
const destroy = (req, res) => {
    models.item
        .delete(req.params.id)
        .then(([result]) => {
            if (result.affectedRows === 0) {
                res.sendStatus(404); // Item non trouvé
            } else {
                res.sendStatus(204); // Suppression réussie
            }
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
};

module.exports = {
    browse,
    read,
    edit,
    add,
    destroy,
};
