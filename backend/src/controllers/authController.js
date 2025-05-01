const bcrypt = require("bcrypt");
const client = require("../../database/client"); // adapte si besoin
const SALT_ROUNDS = 10;

async function registerUser(req, res) {
  const {
    prenom,
    nom,
    telephone,
    email,
    mot_de_passe,
    entreprise,
    pays,
    adresse,
    ville,
    code_postal,
  } = req.body;

  if (
    !prenom || !nom || !telephone || !email || !mot_de_passe ||
    !entreprise || !pays || !adresse || !ville || !code_postal
  ) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const [existing] = await client.query("SELECT id_user FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, SALT_ROUNDS);

    await client.query(
        `INSERT INTO users (prenom, nom, telephone, email, password, entreprise, pays, adresse, ville, postal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [prenom, nom, telephone, email, hashedPassword, entreprise, pays, adresse, ville, code_postal]
      );
   
    res.status(201).json({ message: "Utilisateur inscrit avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
}

module.exports = { registerUser };


async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  try {
    const [rows] = await client.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Création de session
    req.session.user = {
      id: user.id_user,
      email: user.email,
      role: user.role,
      nom: user.nom,
    };

    res.json({ message: "Connexion réussie", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
}

module.exports = { registerUser, loginUser };


function checkSession(req, res) {
    if (req.session.user) {
      res.json({
        message: "Session active",
        user: req.session.user,
      });
    } else {
      res.status(401).json({ message: "Aucune session active" });
    }
  }
  
  module.exports = {
    registerUser,
    loginUser,
    checkSession,
  };
  
  function logoutUser(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Erreur lors de la déconnexion :", err);
        return res.status(500).json({ message: "Erreur lors de la déconnexion." });
      }
  
      res.clearCookie("connect.sid");
      res.json({ message: "Déconnexion réussie" });
    });
  }
  module.exports = {
    registerUser,
    loginUser,
    checkSession,
    logoutUser,
  };
  

  const crypto = require("crypto");
  const transporter = require("../utils/mailer");
  
  async function forgotPassword(req, res) {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email requis." });
    }
  
    try {
      const [users] = await client.query("SELECT * FROM users WHERE email = ?", [email]);
  
      if (users.length === 0) {
        return res.status(404).json({ message: "Aucun utilisateur avec cet email." });
      }
  
      const user = users[0];
  
      const token = crypto.randomBytes(32).toString("hex");
      const expireDate = new Date(Date.now() + 3600000); // 1h
  
      await client.query(
        "UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE id_user = ?",
        [token, expireDate, user.id_user]
      );
  
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Réinitialisation de mot de passe",
        html: `
          <p>Bonjour ${user.prenom},</p>
          <p>Voici le lien pour réinitialiser votre mot de passe :</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Ce lien est valable pendant 1 heure.</p>
        `,
      });
  
      res.json({ message: "Email de réinitialisation envoyé." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur lors de la demande de réinitialisation." });
    }
  }
  module.exports = {
    registerUser,
    loginUser,
    checkSession,
    logoutUser,
    forgotPassword,
  };

  async function resetPassword(req, res) {
    const { email, token, newPassword } = req.body;
  
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }
  
    try {
      const [users] = await client.query(
        "SELECT * FROM users WHERE email = ? AND reset_token = ?",
        [email, token]
      );
  
      if (users.length === 0) {
        return res.status(400).json({ message: "Lien invalide ou expiré." });
      }
  
      const user = users[0];
  
      if (new Date(user.reset_token_expire) < new Date()) {
        return res.status(400).json({ message: "Le lien a expiré." });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await client.query(
        `UPDATE users
         SET password = ?, reset_token = NULL, reset_token_expire = NULL
         WHERE id_user = ?`,
        [hashedPassword, user.id_user]
      );
  
      res.json({ message: "Mot de passe mis à jour avec succès." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur lors de la réinitialisation." });
    }
  }
  module.exports = {
    registerUser,
    loginUser,
    checkSession,
    logoutUser,
    forgotPassword,
    resetPassword
  }  