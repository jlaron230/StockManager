const tables = require("../models");


const browse = async (req, res) => {
  try {
    const [rows] = await tables.product.readAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const read = async (req, res) => {
  try {
    const [rows] = await tables.product.read(req.params.id);
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
    const product = req.body;

    const [result] = await tables.product.insert(product);

    res.status(201).json({
      id_product: result.insertId,
      ...product,
    });
  } catch (err) {
    console.error("Erreur dans productControllers.add :", err);
    res.sendStatus(500);
  }
};


const edit = async (req, res) => {
  try {
    const product = req.body;

    const [result] = await tables.product.update(req.params.id, product);
    console.log(result);
    if (result.affectedRows === 0) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
    
  } catch (err) {
    console.error("Erreur dans productControllers.edit :", err);
    res.sendStatus(500);
  }
};


const destroy = async (req, res) => {
  try {
    const [result] = await tables.product.delete(req.params.id);
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const getByCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    const products = await tables.product.findByCategory(categoryId);


    res.json(products);
  } catch (err) {
    console.error('Erreur getByCategory:', err);
    res.sendStatus(500);
  }
};


module.exports = {
  browse,
  read,
  add,
  edit,
  destroy,
  getByCategory
};

