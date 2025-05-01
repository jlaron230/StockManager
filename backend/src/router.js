const express = require("express");

const router = express.Router();

const itemControllers = require("./controllers/itemControllers");
const authRoutes = require("./routes/auth");

router.get("/items", itemControllers.browse);
router.get("/items/:id", itemControllers.read);
router.put("/items/:id", itemControllers.edit);
router.post("/items", itemControllers.add);
router.delete("/items/:id", itemControllers.destroy);
router.use("/auth", authRoutes);


module.exports = router;






