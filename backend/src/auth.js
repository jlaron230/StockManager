const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// Hashage du mot de passe lors de l'inscription
const hashPassword = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    next();
  } catch (err) {
    console.error("Erreur lors du hashage du mot de passe :", err);
    res.sendStatus(500);
  }
};

// Middleware de protection par session
const requireLogin = (req, res, next) => {
     
    if (!req.session?.user) {
      return res.status(401).json({ message: "Non autorisé : veuillez vous connecter." });
    }
    next();
  };
  
module.exports = {
  hashPassword,
  requireLogin,
};
