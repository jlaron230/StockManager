require("dotenv").config();

const mysql = require("mysql2/promise");

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

// Vérifie la connexion
pool.getConnection().catch(() => {
  console.warn(
    "Warning:",
    "Failed to get a DB connection.",
    "Did you create a .env file with valid credentials?",
    "Routes using models won't work as intended"
  );
});

// Déclaration des managers
const models = {};

const ItemManager = require("./ItemManager");
models.item = new ItemManager();
models.item.setDatabase(pool);

const UserManager = require("./UserManager");
models.user = new UserManager();
models.user.setDatabase(pool);

const ProductManager = require("./ProductManager");
models.product = new ProductManager();
models.product.setDatabase(pool);

const ProviderManager = require("./ProviderManager");
models.provider = new ProviderManager();
models.provider.setDatabase(pool);

const StockManager = require("./StockManager");
models.stock = new StockManager();
models.stock.setDatabase(pool);

const OrderManager = require("./OrderManager");
models.order = new OrderManager();
models.order.setDatabase(pool);

const OrderProductManager = require("./OrderProductManager");
models.order_product = new OrderProductManager();
models.order_product.setDatabase(pool);

const CategoryManager = require("./CategoryManager");
models.category = new CategoryManager();
models.category.setDatabase(pool);

const StoreManager = require("./StoreManager");
models.store = new StoreManager();
models.store.setDatabase(pool);


const NotificationManager = require("./NotificationManager");
models.notification = new NotificationManager();
models.notification.setDatabase(pool);

const Notification_productManager = require("./Notification_productManager");
models.notification_product = new Notification_productManager();
models.notification_product.setDatabase(pool);

// Proxy pour erreurs personnalisées
const handler = {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop];
    }

    const pascalize = (string) =>
      string.slice(0, 1).toUpperCase() + string.slice(1);

    throw new ReferenceError(
      `models.${prop} is not defined. Did you create ${pascalize(
        prop
      )}Manager.js, and did you register it in backend/src/models/index.js?`
    );
  },
};

module.exports = new Proxy(models, handler);
