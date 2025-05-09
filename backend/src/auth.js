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

// Function to verify the user's password during login
const verifyPassword = async (req, res, next) => {
    console.log(req.user, "req user avant verif pass");
    console.log(req.user.id);
    try {
        if (!req.body.password || !req.user?.password) {
            return res.status(400).json({ message: "Mot de passe manquant." });
        }


        const isPasswordValid = await bcrypt.compare(req.body.password, req.user.password);
        // Verify the password using argon2 library

        if (isPasswordValid) {
            console.log("Password verification succeeded");

            // Generate JWT token upon successful password verification
            req.session.user = {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role,
                nom: req.user.nom,
            };

            // Remove sensitive information (password) from the user object before sending it back
            delete req.user.password;
            next(); // Move to the next middleware only if password is valid
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        console.error('Error verifying password:', err);
        res.sendStatus(500);

    }
    next();
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
    verifyPassword,
};
