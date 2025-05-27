const tables = require("../models");
const bcrypt = require("bcrypt");

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

 const updateFcmToken = async (req, res) => {
    try {
      const userId = req.session.user?.id;
      if (!userId) return res.sendStatus(401);
  
      const { fcm_token } = req.body;
      if (!fcm_token) return res.status(400).json({ message: "Token manquant" });
  
      await tables.user.updateFcmToken(userId, fcm_token);
      res.sendStatus(204);
    } catch (err) {
      console.error("Erreur updateFcmToken :", err);
      res.sendStatus(500);
    }
  };

const getAllUsers = async (req, res) => {
  try {
    const [users] = await tables.user.findAll();
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await tables.user.delete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Erreur deleteUser :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, role } = req.body;

  try {
    await tables.user.update(id, { nom, prenom, email, role });
    res.sendStatus(204);
  } catch (err) {
    console.error("Erreur updateUser :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


const createUser = async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;

  if (!nom || !prenom || !email || !password || !role) {
    return res.status(400).json({ message: "Champs requis." });
  }

  try {
    
    const existing = await tables.user.findUserByEmail(email);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await tables.user.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    console.error("Erreur createUser :", err);
    res.status(500).json({ message: "Erreur serveur lors de la création." });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
  updateFcmToken,
};
