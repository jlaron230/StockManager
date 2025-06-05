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

console.log("🧭 Routeurs utilisateurs chargés :", userControllers.updateFcmToken?.toString());//temporaire

const { testNotif } = require("./controllers/notificationTestController");

router.use((req, res, next) => {
  console.log(`📡 Requête reçue : ${req.method} ${req.url}`);   //temporaire
  next();
});



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
router.delete("/user/:id", requireAdmin, userControllers.deleteUser);
router.put("/user/:id", userControllers.updateUser);

router.post("/user", requireAdmin, requireLogin, userControllers.createUser);

router.put("/users/:id/token-mobil", userControllers.updateMobileToken);

router.put("/user/token", userControllers.updateFcmToken);

router.post("/register", hashPassword, registerUser);
router.post("/login", loginUser, verifyPassword);
router.get("/session", requireLogin, checkSession);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/store", requireLogin, storeControllers.browse);

router.get("/products", productControllers.browse);
router.get("/products/:id", requireLogin, productControllers.read);


router.post("/products", requireAdmin,productControllers.add);
router.put("/products/:id", requireAdmin,productControllers.edit);
router.delete("/products/:id", requireAdmin,productControllers.destroy);
router.get("/products/category/:id", requireLogin, productControllers.getByCategory);

router.get("/providers", requireLogin, providerControllers.browse);
router.get("/providers/:id", requireLogin, providerControllers.read);
router.post("/providers", requireAdmin, providerControllers.add);
router.put("/providers/:id", requireAdmin, providerControllers.edit);
router.delete("/providers/:id", requireAdmin, providerControllers.destroy);
router.get('/provider-types', requireLogin, providerControllers.getProviderType);

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

router.get("/categories", requireLogin, categoryControllers.browse);
router.get("/categories/:id", requireLogin, categoryControllers.read);
router.get("/categories/:id/providers", requireLogin, categoryControllers.getProvidersByCategory);
router.post("/categories", requireAdmin, categoryControllers.add);
router.put("/categories/:id", requireAdmin, categoryControllers.edit);
router.delete("/categories/:id", requireAdmin, categoryControllers.destroy);




router.get("/items", itemControllers.browse);
router.get("/items/:id", itemControllers.read);
router.put("/items/:id", itemControllers.edit);
router.post("/items", itemControllers.add);
router.delete("/items/:id", itemControllers.destroy);

module.exports = router;






