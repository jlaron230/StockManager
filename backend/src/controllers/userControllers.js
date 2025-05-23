const tables = require("../models");

// GET /user/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.sendStatus(401);

    const [rows] = await tables.user.findById(userId);
    if (rows.length === 0) return res.sendStatus(404);

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Erreur getProfile :", err);
    res.sendStatus(500);
  }
};

// PUT /user/profile
const updateProfile = async (req, res) => {
    try {
      const userId = req.session.user?.id;
      if (!userId) return res.status(401).json({ message: "Non autorisé" });
  
      await tables.user.updateProfile(userId, req.body);
      res.sendStatus(204);
    } catch (err) {
      console.error("Erreur updateProfile :", err);
      res.sendStatus(500);
    }
  };

module.exports = {
  getProfile,
  updateProfile,
};
