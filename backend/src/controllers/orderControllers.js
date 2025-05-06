const tables = require("../models");

const add = async (req, res) => {
  const order = req.body;

  try {
    const [orderResult] = await tables.order.insert({
      ...order,
      total_ammount: 0 // temporairement
    });

    const id_order = orderResult.insertId;

    
    const insertPromises = order.products.map((p) =>
      tables.order_product.insert({
        id_order,
        id_product: p.id_product,
        quantité_commandée: p.quantité
      })
    );
    await Promise.all(insertPromises);

    const [detailedProducts] = await tables.order_product.findFullDetailsByOrderId(id_order);

    const total = detailedProducts.reduce((sum, product) => {
      return sum + product.prix_unitaire * product.quantité_commandée;
    }, 0);

    
    await tables.order.updateTotal(id_order, total);

    res.status(201).json({
      id_order,
      total_ammount: total,
      ...order,
    });
  } catch (err) {
    console.error("Erreur dans orderControllers.add :", err);
    res.sendStatus(500);
  }
};



const read = async (req, res) => {
  try {
    const [rows] = await tables.order.read(req.params.id);
    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    console.error("Erreur dans orderControllers.read :", err);
    res.sendStatus(500);
  }
};

const readStatus = async (req, res) => {
  try {
    const [rows] = await tables.order.readStatus(req.params.id);
    if (rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    console.error("Erreur dans orderControllers.readStatus :", err);
    res.sendStatus(500);
  }

};

const getProductsFromOrder = async (req, res) => {
  try {
    const [rows] = await tables.order_product.findByOrderId(req.params.id);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur getProductsFromOrder :", err);
    res.sendStatus(500);
  }
};

const getFullOrder = async (req, res) => {
  try {
    const [orderRows] = await tables.order.read(req.params.id);
    if (orderRows.length === 0) return res.sendStatus(404);

    const [productRows] = await tables.order_product.findFullDetailsByOrderId(req.params.id);

    res.status(200).json({
      order: orderRows[0],
      products: productRows,
    });
  } catch (err) {
    console.error("Erreur getFullOrder :", err);
    res.sendStatus(500);
  }
};

module.exports = {
  add,
  read,
  readStatus,
  getProductsFromOrder,
  getFullOrder,
};
