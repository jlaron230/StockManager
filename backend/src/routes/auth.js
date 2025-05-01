const express = require("express");
const router = express.Router();
const { registerUser, loginUser, checkSession, logoutUser, forgotPassword, resetPassword} = require("../controllers/authController");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/session", checkSession);
router.get("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
 


module.exports = router;








