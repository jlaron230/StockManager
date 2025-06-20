const tables = require("../models");
const { tr } = require("@faker-js/faker");

// Ajouter une commande
const add = async (req, res) => {
  const order = req.body;

  try {
    // Vérifie que tous les produits appartiennent au fournisseur choisi
    const productIds = order.products.map((p) => p.id_product);
    const [products] = await tables.product.getProvidersByIds(productIds);

    const produitsInvalides = products.filter(
        (p) => p.id_provider !== order.id_provider
    );

    if (produitsInvalides.length > 0) {
      return res.status(400).json({
        message: "Tous les produits doivent appartenir au même fournisseur.",
        produitsInvalides,
      });
    }

    // Crée la commande avec un total à 0
    const orderResult = await tables.order.insert({
      ...order,
      total_ammount: 0,
    });

    // Met à jour le stock pour chaque produit commandé
    const stockUpdatePromises = order.products
        .filter((p) => p.id_product && p.quantité != null)
        .map((p) => tables.product.incrementStock(p.id_product, p.quantité));
    await Promise.all(stockUpdatePromises);

    const id_order = orderResult.insertId;

    // Insère les produits liés à la commande
    const insertPromises = order.products.map((p) =>
        tables.order_product.insert({
          id_order,
          id_product: p.id_product,
          quantité_commandée: p.quantité,
        })
    );
    await Promise.all(insertPromises);

    // Calcule le total de la commande
    const [detailedProducts] = await tables.order_product.findFullDetailsByOrderId(
        id_order
    );
    const total = detailedProducts.reduce(
        (sum, product) => sum + product.prix_unitaire * product.quantité_commandée,
        0
    );

    // Met à jour le total dans la commande
    await tables.order.updateTotal(id_order, total);

    // Répond avec la commande créée et son total
    res.status(201).json({
      id_order,
      total_ammount: total,
      ...order,
    });
  } catch (err) {
    console.error("Erreur dans orderControllers.add :", err);
    if (err.stack) console.error(err.stack);
    res.sendStatus(500);
  }
};

// Met à jour une commande (quand elle est "terminée")
const update = async (req, res) => {
  const order = req.body;
  const id_order = req.params.id;

  // Ne traite que les commandes terminées
  if (order.statut !== "terminée") {
    return res.sendStatus(204);
  }

  try {
    // Vérifie que la commande existe et n'est pas validée
    const [existingOrder] = await tables.order.read(id_order);
    if (!existingOrder) {
      return res.status(404).json({ message: "Commande introuvable." });
    }

    if (existingOrder.is_validated) {
      return res.status(400).json({ message: "La commande est déjà validée." });
    }

    // Vérifie que tous les produits correspondent au fournisseur
    const productIds = order.products.map((p) => p.id_product);
    const [products] = await tables.product.getProvidersByIds(productIds);

    const produitsInvalides = products.filter(
        (p) => String(p.id_provider) !== String(order.id_provider)
    );

    if (produitsInvalides.length > 0) {
      return res.status(400).json({
        message: "Certains produits ne correspondent pas au fournisseur sélectionné.",
        invalidProducts: produitsInvalides,
      });
    }

    // Met à jour les infos principales de la commande
    await tables.order.update(id_order, order);

    // Supprime les anciens produits liés à la commande
    await tables.order_product.deleteByOrderId(id_order);

    // Insère les nouveaux produits liés à la commande
    const insertions = order.products.map((p) =>
        tables.order_product.insert({
          id_order,
          id_product: p.id_product,
          quantité_commandée: p.quantité,
        })
    );
    await Promise.all(insertions);

    // Récupère les prix unitaires pour calculer le total
    const [productDetails] = await tables.product.getDetailsByIds(productIds);

    // Calcule le total
    let totalAmount = 0;
    order.products.forEach((p) => {
      const product = productDetails.find((pd) => pd.id_product === p.id_product);
      if (product) {
        totalAmount += product.prix_unitaire * p.quantité;
      }
    });

    // Met à jour le total dans la commande
    await tables.order.update(id_order, {
      ...order,
      total_ammount: totalAmount,
    });

    return res.sendStatus(204);
  } catch (err) {
    console.error("Erreur dans orderControllers.update :", err);
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour de la commande.",
    });
  }
};

// Lire une commande par ID
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

// Lire toutes les commandes
const readAll = async (req, res) => {
  try {
    const [rows] = await tables.order.readAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Lire le statut d’une commande par ID
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

// Obtenir les produits d’une commande
const getProductsFromOrder = async (req, res) => {
  try {
    const [rows] = await tables.order_product.findByOrderId(req.params.id);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur getProductsFromOrder :", err);
    res.sendStatus(500);
  }
};

// Obtenir les détails complets d’une commande
const getFullOrder = async (req, res) => {
  try {
    const [orderRows] = await tables.order.read(req.params.id);
    if (orderRows.length === 0) return res.sendStatus(404);

    const [productRows] = await tables.order_product.findFullDetailsByOrderId(
        req.params.id
    );

    res.status(200).json({
      order: orderRows[0],
      products: productRows,
    });
  } catch (err) {
    console.error("Erreur getFullOrder :", err);
    res.sendStatus(500);
  }
};

// Obtenir les totaux de toutes les commandes
const getOrderTotals = async (req, res) => {
  try {
    const [rows] = await tables.order_product.findAllWithDetails();
    res.json(rows);
  } catch (err) {
    console.error("Erreur dans getOrderTotals :", err);
    res.sendStatus(500);
  }
};

// Supprimer une commande
const destroy = async (req, res) => {
  try {
    const [result] = await tables.order.delete(req.params.id);
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

module.exports = {
  add,
  update,
  read,
  readStatus,
  getProductsFromOrder,
  getFullOrder,
  readAll,
  destroy,
  getOrderTotals,
};
