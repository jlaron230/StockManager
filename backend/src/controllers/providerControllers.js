const tables = require("../models");

const browse = async (req, res) => {
  try {
    const [rows] = await tables.provider.readAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const read = async (req, res) => {
  try {
    const [rows] = await tables.provider.read(req.params.id);
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

const add = async (req, res) => {
  try {
    const [result] = await tables.provider.insert(req.body);
    res.status(201).json({ id_provider: result.insertId, ...req.body });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const edit = async (req, res) => {
  try {
    const [result] = await tables.provider.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json({ id_provider: req.params.id, ...req.body });
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const destroy = async (req, res) => {
  const id = req.params.id;

  try {
    // Supprimer les produits liés à ce fournisseur
    await tables.product.deleteByProvider(id);

    // Ensuite, supprimer le fournisseur
    const [result] = await tables.provider.delete(id);

    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204); // No Content
    }

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getProviderType = async (req, res) => {
  try {
    const [providerType] = await tables.provider.show();
    const enumValue = providerType[0].Type.match(/enum\((.+)\)/)[1]
        .split(',')
        .map(val => val.replace(/'/g, ''));

    res.json(enumValue);
  }
  catch (err) {
    console.error("Erreur lors de la récupération des types de fournisseur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
module.exports = {
  browse,
  read,
  add,
  edit,
  destroy,
  getProviderType,
};

