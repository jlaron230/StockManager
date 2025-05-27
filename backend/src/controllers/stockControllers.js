const tables = require("../models");

const browse = async (req, res) => {
  try {
    const [rows] = await tables.stock.readAllStock();
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur dans stockControllers.browse :", err);
    res.sendStatus(500);
  }
};

const read = async (req, res) => {
  try {
    const [rows] = await tables.stock.readStockByProductId(req.params.productId);
    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    console.error("Erreur dans stockControllers.read :", err);
    res.sendStatus(500);
  }
};

const getLowStock = async (req, res) => {
    try {
      const [rows] = await tables.stock.getLowStockProducts();
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
};

const getStockByCategory = async (req, res) => {
  try {
    const [rows] = await tables.stock.getTotalStockByCategory();
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur getStockByCategory :", err);
    res.sendStatus(500);
  }
};

  
module.exports = {
    browse,
    read,
    getLowStock,
    getStockByCategory
  };
  