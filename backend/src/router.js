const express = require("express");
const router = express.Router();
const itemControllers = require("./controllers/itemControllers");
const productControllers = require("./controllers/productControllers");
const providerControllers = require("./controllers/providerControllers");
const stockControllers = require("./controllers/stockControllers");
const orderControllers = require("./controllers/orderControllers");




//import middleware functions
const {
    verifyPassword,hashPassword,verifyToken,verifyId,
} = require("./auth");

const { registerUser, loginUser, checkSession, logoutUser, forgotPassword, resetPassword} = require("../src/controllers/authController");

router.post("/register", hashPassword, registerUser);
router.post("/login", loginUser);
router.get("/session", checkSession);
router.get("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/products", productControllers.browse);
router.get("/products/:id", productControllers.read);
router.post("/products", productControllers.add);
router.put("/products/:id", productControllers.edit);
router.delete("/products/:id", productControllers.destroy);

router.get("/providers", providerControllers.browse);
router.get("/providers/:id", providerControllers.read);
router.post("/providers", providerControllers.add);
router.put("/providers/:id", providerControllers.edit);
router.delete("/providers/:id", providerControllers.destroy);

router.get("/stock", stockControllers.browse);
router.get("/stock/low", stockControllers.getLowStock);
router.get("/stock/:productId", stockControllers.read);

router.post("/orders", orderControllers.add);
router.get("/orders/:id/status", orderControllers.readStatus);
router.get("/orders/:id/products", orderControllers.getProductsFromOrder);
router.get("/orders/:id", orderControllers.read);
router.get("/orders/:id/full", orderControllers.getFullOrder);




router.get("/items", itemControllers.browse);
router.get("/items/:id", itemControllers.read);
router.put("/items/:id", itemControllers.edit);
router.post("/items", itemControllers.add);
router.delete("/items/:id", itemControllers.destroy);

module.exports = router;






