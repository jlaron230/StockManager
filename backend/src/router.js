const express = require("express");
const router = express.Router();
const itemControllers = require("./controllers/itemControllers");

//import middleware functions
const {
    verifyPassword,hashPassword,verifyToken,verifyId,
} = require("./auth");

const { registerUser, loginUser, checkSession, logoutUser, forgotPassword, resetPassword} = require("../src/controllers/authController");

router.post("/register", hashPassword, registerUser);
router.post("/login", loginUser, verifyPassword);
router.get("/session", checkSession);
router.get("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/items", itemControllers.browse);
router.get("/items/:id", itemControllers.read);
router.put("/items/:id", itemControllers.edit);
router.post("/items", itemControllers.add);
router.delete("/items/:id", itemControllers.destroy);

module.exports = router;






