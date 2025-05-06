const bcrypt = require("bcrypt");
const client = require("../../database/client"); // adapte si besoin
const SALT_ROUNDS = 10;
const models = require("../models");

async function registerUser(req, res) {

  try {
    const users = req.body;
    const result = await models.user.insert(users)
   
    res.status(201).location(`/users/${result.insertId}`).json({ message: "Utilisateur inscrit avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).location({ message: "Erreur serveur lors de l'inscription." });
  }
}


async function loginUser(req, res, next) {
  const {email} = req.body;
  try {
    const user = await models.user.findUserByEmail(email);

    if (user[0] != null) {
      const [firstUser] = user;
      req.user = firstUser; // Passe l'utilisateur au middleware suivant
      console.log(req.user);
      next(); // Passe au middleware suivant (ex: verifyPassword)
    } else {
      res.status(401).json({ message: "Utilisateur non trouvé." });
    }
  } catch (error) {
    console.error("Erreur serveur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
}



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