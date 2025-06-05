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

async function partialUpdate(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = ['nom', 'description', 'prix_unitaire', 'quantité_en_stock', 'seuil_minimal', 'id_category'];
    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedFields.includes(key))
    );

    const result = await tables.product.updatePartial(id, safeUpdates);

    if (result.affectedRows === 0) {
      return res.sendStatus(404);
    }

    res.status(200).json({ message: 'Produit mis à jour.', result });
  } catch (err) {
    console.error("Erreur PATCH product:", err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour partielle.' });
  }
}



module.exports = {
  browse,
  read,
  add,
  edit,
  destroy,
  getByCategory,
  partialUpdate
};

