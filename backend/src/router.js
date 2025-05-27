const express = require("express");
const router = express.Router();
const itemControllers = require("./controllers/itemControllers");
const productControllers = require("./controllers/productControllers");
const providerControllers = require("./controllers/providerControllers");
const stockControllers = require("./controllers/stockControllers");
const orderControllers = require("./controllers/orderControllers");
const userControllers = require("./controllers/userControllers");
const categoryControllers = require("./controllers/categoryControllers");

//import middleware functions
const {
    hashPassword,
    requireLogin,
    verifyPassword
  } = require("./auth");
  
const { registerUser, loginUser, checkSession, logoutUser, forgotPassword, resetPassword,} = require("../src/controllers/authController");


router.get("/users", userControllers.getAllUsers);
router.get("/user/profile", requireLogin, userControllers.getProfile);
router.put("/user/profile", requireLogin, userControllers.updateProfile);
router.delete("/user/:id", userControllers.deleteUser);
router.put("/user/:id", userControllers.updateUser);
router.post("/user", userControllers.createUser);
router.put("/users/:id/token-mobil", userControllers.updateMobileToken);


router.post("/register", hashPassword, registerUser);
router.post("/login", loginUser, verifyPassword);
router.get("/session", checkSession);
router.get("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/products", productControllers.browse);
router.get("/products/:id", productControllers.read);
router.post("/products", productControllers.add);
router.put("/products/:id", productControllers.edit);
router.delete("/products/:id", productControllers.destroy);
router.get("/products/category/:id", productControllers.getByCategory);


router.get("/providers", providerControllers.browse);
router.get("/providers/:id", providerControllers.read);
router.post("/providers", providerControllers.add);
router.put("/providers/:id",  providerControllers.edit);
router.delete("/providers/:id", providerControllers.destroy);

router.get("/stock", stockControllers.browse);
router.get("/stock/categorie", stockControllers.getStockByCategory);
router.get("/stock/low", stockControllers.getLowStock);
router.get("/stock/:productId", stockControllers.read);



router.post("/orders", orderControllers.add);
router.get("/orders/:id/status", orderControllers.readStatus);
router.get("/orders/:id/products", orderControllers.getProductsFromOrder);
router.get("/orders/:id", orderControllers.read);
router.put("/orders/:id", requireLogin, orderControllers.update);
router.get("/orders/:id/full", orderControllers.getFullOrder);

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






