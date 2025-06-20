const tables = require("../models");
const bcrypt = require("bcrypt");

// Récupère le profil de l'utilisateur connecté (GET /user/profile)
const getProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.sendStatus(401); // Non autorisé si pas connecté

    const [rows] = await tables.user.findById(userId);
    if (rows.length === 0) return res.sendStatus(404); // Pas trouvé

    res.status(200).json(rows[0]); // Retourne le profil utilisateur
  } catch (err) {
    console.error("Erreur getProfile :", err);
    res.sendStatus(500); // Erreur serveur
  }
};

// Met à jour le profil de l'utilisateur connecté (PUT /user/profile)
const updateProfile = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Non autorisé" });

    await tables.user.updateProfile(userId, req.body);
    res.sendStatus(204); // Mise à jour OK, pas de contenu
  } catch (err) {
    console.error("Erreur updateProfile :", err);
    res.sendStatus(500);
  }
};

// Met à jour le token FCM pour notifications push
const updateFcmToken = async (req, res) => {
  console.log("🟢 Contrôleur updateFcmToken appelé");
  const userId = req.session.user?.id;
  const { fcm_token } = req.body;

  console.log("🧾 Body :", req.body);
  console.log("👤 userId :", userId);

  try {
    await tables.user.updateFcmToken(userId, fcm_token);
    console.log("✅ Token mis à jour pour", userId);
    res.status(200).json({ updated: true });
  } catch (err) {
    console.error("❌ Erreur update :", err);
    res.status(500).json({ error: "fail" });
  }
};

// Récupère tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const [users] = await tables.user.findAll();
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprime un utilisateur par ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await tables.user.delete(id);
    res.sendStatus(204); // Suppression OK, pas de contenu
  } catch (error) {
    console.error("Erreur deleteUser :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Met à jour un utilisateur par ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = req.body;

  try {
    const [existingUser] = await tables.user.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
    }

    await tables.user.updateUser(id, fieldsToUpdate);
    res.sendStatus(204);
  } catch (err) {
    console.error("Erreur updateUser :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Crée un nouvel utilisateur
const createUser = async (req, res) => {
  const { nom, prenom, email, password, role = "employe" } = req.body;

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

// Met à jour le token mobile pour notifications (différent de FCM classique)
const updateMobileToken = async (req, res) => {
  try {
    const { fcm_token_mobil } = req.body;

    if (!fcm_token_mobil) {
      return res.status(400).send("Token manquant");
    }

    await tables.user.updateTokenMobil(req.params.id, fcm_token_mobil);
    res.sendStatus(204);
  } catch (err) {
    console.error("Erreur lors de l'enregistrement du token mobile :", err);
    res.sendStatus(500);
  }
};

console.log("🎯 userControllers.js chargé");   // message temporaire

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
  updateFcmToken,
  updateMobileToken
};
