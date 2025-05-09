const tables = require("../models");

const browse = async (req, res) => {
  try {
    const [rows] = await tables.category.readAll();
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur browse :", err);
    res.sendStatus(500);
  }
};

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

const add = async (req, res) => {
  try {
    const [result] = await tables.category.insert(req.body);
    res.status(201).json({ id_category: result.insertId, ...req.body });
  } catch (err) {
    console.error("Erreur add :", err);
    res.sendStatus(500);
  }
};

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
