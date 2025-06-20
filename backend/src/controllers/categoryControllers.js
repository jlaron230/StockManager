const tables = require("../models");

// Récupère toutes les catégories
const browse = async (req, res) => {
  try {
    const [rows] = await tables.category.readAll();
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur browse :", err);
    res.sendStatus(500);
  }
};

// Récupère une catégorie par son id
const read = async (req, res) => {
  try {
    const [rows] = await tables.category.read(req.params.id);
    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    console.error("Erreur read :", err);
    res.sendStatus(500);
  }
};

// Ajoute une nouvelle catégorie
const add = async (req, res) => {
  try {
    const [result] = await tables.category.insert(req.body);
    res.status(201).json({ id_category: result.insertId, ...req.body });
  } catch (err) {
    console.error("Erreur add :", err);
    res.sendStatus(500);
  }
};

// Modifie une catégorie existante par son id
const edit = async (req, res) => {
  try {
    const [result] = await tables.category.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error("Erreur edit :", err);
    res.sendStatus(500);
  }
};

// Supprime une catégorie par son id
const destroy = async (req, res) => {
  try {
    const [result] = await tables.category.delete(req.params.id);
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error("Erreur destroy :", err);
    res.sendStatus(500);
  }
};

// Récupère les fournisseurs associés à une catégorie par son id
const getProvidersByCategory = async (req, res) => {
  try {
    const [rows] = await tables.provider.findByCategoryId(req.params.id);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur getProvidersByCategory :", err);
    res.sendStatus(500);
  }
};

module.exports = {
  browse,
  read,
  add,
  edit,
  destroy,
  getProvidersByCategory,
};
