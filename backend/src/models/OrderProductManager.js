const AbstractManager = require("./AbstractManager");

class OrderProductManager extends AbstractManager {
  constructor() {
    super({ table: "order_product" });
  }

  insert(orderProduct) {
    return this.database.query(
      `INSERT INTO ${this.table} (id_order, id_product, quantité_commandée)
       VALUES (?, ?, ?)`,
      [orderProduct.id_order, orderProduct.id_product, orderProduct.quantité_commandée]
    );
  }
  

  findByOrderId(orderId) {
    return this.database.query(
      `SELECT op.id_product, p.nom
       FROM order_product op
       JOIN product p ON op.id_product = p.id_product
       WHERE op.id_order = ?`,
      [orderId]
    );
  }

  findFullDetailsByOrderId(orderId) {
    return this.database.query(
      `SELECT 
        p.id_product,
        p.nom,
        p.description,
        p.prix_unitaire,
        op.quantité_commandée
       FROM order_product op
       JOIN product p ON op.id_product = p.id_product
       WHERE op.id_order = ?`,
      [orderId]
    );
  }
}


  

module.exports = OrderProductManager;
