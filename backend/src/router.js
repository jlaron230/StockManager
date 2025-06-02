const express = require("express");
const router = express.Router();
const itemControllers = require("./controllers/itemControllers");
const productControllers = require("./controllers/productControllers");
const providerControllers = require("./controllers/providerControllers");
const stockControllers = require("./controllers/stockControllers");
const orderControllers = require("./controllers/orderControllers");
const userControllers = require("./controllers/userControllers");
const categoryControllers = require("./controllers/categoryControllers");
const storeControllers = require("./controllers/storeControllers");

const { testNotif } = require("./controllers/notificationTestController");

//import middleware functions
const {
    hashPassword,
    requireLogin,
    verifyPassword, requireAdmin
} = require("./auth");
  
const { registerUser, loginUser, checkSession, logoutUser, forgotPassword, resetPassword,} = require("../src/controllers/authController");

router.post("/notify", testNotif);
router.get("/users", userControllers.getAllUsers);
router.get("/user/profile", requireLogin, userControllers.getProfile);
router.put("/user/profile", requireLogin, userControllers.updateProfile);
router.delete("/user/:id", userControllers.deleteUser);
router.put("/user/:id", userControllers.updateUser);

router.post("/user", requireAdmin, requireLogin, userControllers.createUser);

router.put("/users/:id/token-mobil", userControllers.updateMobileToken);

router.put("/user/token", requireLogin, userControllers.updateFcmToken);


router.post("/register", hashPassword, registerUser);
router.post("/login", loginUser, verifyPassword);
router.get("/session", requireLogin, checkSession);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/store", requireLogin, storeControllers.browse);

router.get("/products", productControllers.browse);
router.get("/products/:id", productControllers.read);


router.post("/products", productControllers.add);
router.put("/products/:id", productControllers.edit);
router.delete("/products/:id", productControllers.destroy);
router.get("/products/category/:id", productControllers.getByCategory);

router.get("/providers", providerControllers.browse);
router.get("/providers/:id", providerControllers.read);
router.post("/providers", requireAdmin, providerControllers.add);
router.put("/providers/:id", requireAdmin, providerControllers.edit);
router.delete("/providers/:id", requireAdmin, providerControllers.destroy);

router.get("/stock", stockControllers.browse);
router.get("/stock/categorie", stockControllers.getStockByCategory);
router.get("/stock/low", stockControllers.getLowStock);
router.get("/stock/:productId", stockControllers.read);



router.post("/orders",requireAdmin, orderControllers.add);
router.get("/orders/:id/status", orderControllers.readStatus);
router.get("/orders/:id/products", orderControllers.getProductsFromOrder);
router.get("/orders-total", orderControllers.getOrderTotals);
router.get("/orders/:id", orderControllers.read);
router.get("/orders", orderControllers.readAll);
router.put("/orders/:id", requireAdmin, orderControllers.update); //requireLogin a ajouté
router.get("/orders/:id/full", orderControllers.getFullOrder);
router.delete("/orders/:id", requireAdmin, orderControllers.destroy);

router.get("/categories", categoryControllers.browse);
router.get("/categories/:id", categoryControllers.read);
router.get("/categories/:id/providers", categoryControllers.getProvidersByCategory);
router.post("/categories", categoryControllers.add);
router.put("/categories/:id", requireLogin, categoryControllers.edit);
router.delete("/categories/:id", requireLogin, categoryControllers.destroy);




router.get("/items", itemControllers.browse);
router.get("/items/:id", itemControllers.read);
router.put("/items/:id", itemControllers.edit);
router.post("/items", itemControllers.add);
router.delete("/items/:id", itemControllers.destroy);

module.exports = router;






