// Importe le framework Express et crée un routeur
const express = require("express");
const router = express.Router();

// Middleware de protection CSRF (non activé avec cookie ici)
const csrf = require("csurf");

// Importe les contrôleurs pour chaque entité du projet
const itemControllers = require("./controllers/itemControllers");
const productControllers = require("./controllers/productControllers");
const providerControllers = require("./controllers/providerControllers");
const stockControllers = require("./controllers/stockControllers");
const orderControllers = require("./controllers/orderControllers");
const userControllers = require("./controllers/userControllers");
const categoryControllers = require("./controllers/categoryControllers");
const storeControllers = require("./controllers/storeControllers");

// Contrôleur de test pour les notifications
const { testNotif } = require("./controllers/notificationTestController");

// Middleware global pour logger chaque requête (temporaire pour debug)
router.use((req, res, next) => {
    console.log(`📡 Requête reçue : ${req.method} ${req.url}`);   //temporaire
    next();
});

// Importe les middlewares liés à l'authentification
const {
    hashPassword,
    requireLogin,
    verifyPassword,
    requireAdmin
} = require("./auth");

// Importe les fonctions de gestion des utilisateurs/authentification
const {
    registerUser,
    loginUser,
    checkSession,
    logoutUser,
    forgotPassword,
    resetPassword,
} = require("../src/controllers/authController");

// Initialise la protection CSRF (ici sans cookie)
const csrfProtection = csrf({ cookie: false });


//Token CSRF
/**
 * @swagger
 * /form-token:
 *   get:
 *     summary: Récupère un token CSRF
 *     tags: [Security]
 *     responses:
 *       200:
 *         description: Token CSRF généré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 csrfToken:
 *                   type: string
 *                   example: "A1B2C3D4..."

 *       403:
 *         description: Session invalide ou token CSRF non généré
 */
router.get("/form-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

//Route notification
/**
 * @swagger
 * /notify:
 *   post:
 *     summary: Envoie une notification test
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Notification envoyée
 *       500:
 *         description: Erreur serveur lors de l'envoi
 */
router.post("/notify", testNotif);

//Routes pour l'utilisateur
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur serveur
 */
router.get("/users", userControllers.getAllUsers);
/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Récupère le profil utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - SessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Le profil de l'utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get("/user/profile", requireLogin, userControllers.getProfile);
/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Met à jour le profil de l'utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - SessionCookieAuth: []
 *     requestBody:
 *       description: Données à mettre à jour
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nom: "Dupont"
 *               prenom: "Jean"
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non authentifié
 */
router.put("/user/profile", requireLogin, userControllers.updateProfile);
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Supprime un utilisateur (admin requis)
 *     tags: [Utilisateurs]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur à supprimer
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       403:
 *         description: Accès refusé
 */
router.delete("/user/:id", requireAdmin, userControllers.deleteUser);
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Met à jour partiellement un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur à mettre à jour
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Champs à mettre à jour
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: "nouveau.email@example.com"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 */
router.patch("/user/:id", userControllers.updateUser);
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Crée un nouvel utilisateur (admin requis)
 *     tags: [Utilisateurs]
 *     security:
 *       - SessionCookieAuth: []
 *     requestBody:
 *       description: Données de l'utilisateur à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nom: "Martin"
 *               email: "martin@example.com"
 *               role: "user"
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       403:
 *         description: Accès refusé
 */
router.post("/user", requireAdmin, requireLogin, userControllers.createUser);
/**
 * @swagger
 * /users/{id}/token-mobil:
 *   put:
 *     summary: Met à jour le token mobile d'un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'utilisateur
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Token mobile
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               tokenMobil: "nouveauToken123"
 *     responses:
 *       200:
 *         description: Token mobile mis à jour
 */
router.put("/users/:id/token-mobil", userControllers.updateMobileToken);
/**
 * @swagger
 * /user/token:
 *   put:
 *     summary: Met à jour le token FCM d'un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       description: Token FCM
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               fcmToken: "tokenFCM123"
 *     responses:
 *       200:
 *         description: Token FCM mis à jour
 */
router.put("/user/token", userControllers.updateFcmToken);

//Route pour l'inscription de l'utilisateur
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       description: Données d'enregistrement
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: "user@example.com"
 *               password: "monMotDePasse"
 *     responses:
 *       201:
 *         description: Utilisateur enregistré
 */
router.post("/register", csrfProtection, hashPassword, registerUser);
//Route pour la connexion de l'utilisateur
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       description: Identifiants de connexion
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: "user@example.com"
 *               password: "monMotDePasse"
 *     responses:
 *       200:
 *         description: Connecté avec succès
 *       401:
 *         description: Identifiants invalides
 */
router.post("/login", csrfProtection, loginUser,  verifyPassword);

//Route pour la session de l'utilisateur
/**
 * @swagger
 * /session:
 *   get:
 *     summary: Vérifie la session de l'utilisateur connecté
 *     tags: [Authentification]
 *     security:
 *       - SessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Session valide
 *       401:
 *         description: Non authentifié
 */
router.get("/session", requireLogin, checkSession);
//Route pour la déconnexion de l'utilisateur
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     tags: [Authentification]
 *     responses:
 *       200:
 *         description: Déconnecté avec succès
 */
router.post("/logout", logoutUser);
/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Demande de réinitialisation du mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       description: Email de l'utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 */
//Route pour le mot de passe oublié de l'utilisateur
router.post("/forgot-password", forgotPassword);
/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Réinitialise le mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       description: Nouveaux mot de passe et token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               token: "tokenReinitialisation"
 *               newPassword: "nouveauMotDePasse"
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 */
//Route pour réinitialiser le mot de passe de l'utilisateur
router.post("/reset-password", resetPassword);
//Route pour obtenir les produits du magasin
/**
 * @swagger
 * /store:
 *   get:
 *     summary: Récupère les magasins (requiert connexion)
 *     tags: [Magasins]
 *     security:
 *       - SessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des magasins
 */
router.get("/store", requireLogin, storeControllers.browse);

//Routes pour les produits
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Liste tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get("/products", productControllers.browse);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupère un produit par son ID (connexion requise)
 *     tags: [Produits]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du produit
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du produit
 *       401:
 *         description: Non authentifié
 */
router.get("/products/:id", requireLogin, productControllers.read);
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Ajoute un produit (admin requis)
 *     tags: [Produits]
 *     security:
 *       - SessionCookieAuth: []
 *     requestBody:
 *       description: Données du produit
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nom: "Produit X"
 *               prix: 100
 *     responses:
 *       201:
 *         description: Produit ajouté
 *       403:
 *         description: Accès refusé
 */
router.post("/products", requireAdmin,productControllers.add);
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Met à jour un produit (admin requis)
 *     tags: [Produits]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du produit à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categorieId:
 *                 type: integer
 *               fournisseurId:
 *                 type: integer
 *             example:
 *               nom: "Produit mis à jour"
 *               description: "Nouveau descriptif"
 *               prix: 59.99
 *               stock: 120
 *               categorieId: 3
 *               fournisseurId: 5
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (admin requis)
 *       404:
 *         description: Produit non trouvé
 */
router.put("/products/:id", requireAdmin,productControllers.edit);
/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Mise à jour partielle d’un produit
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nom: "Produit modifié"
 *     responses:
 *       200:
 *         description: Produit mis à jour partiellement
 */
router.patch("/products/:id", productControllers.partialUpdate);
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprime un produit (admin requis)
 *     tags: [Produits]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Produit supprimé
 */
router.delete("/products/:id", requireAdmin,productControllers.destroy);
/**
 * @swagger
 * /products/category/{id}:
 *   get:
 *     summary: Récupère les produits d’une catégorie (connexion requise)
 *     tags: [Produits]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des produits de la catégorie
 */
router.get("/products/category/:id", requireLogin, productControllers.getByCategory);

//Routes pour les fournisseurs
/**
 * @swagger
 * /providers:
 *   get:
 *     summary: Liste les fournisseurs
 *     tags: [Fournisseurs]
 *     security:
 *       - SessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des fournisseurs
 */
router.get("/providers", requireLogin, providerControllers.browse);
/**
 * @swagger
 * /providers/{id}:
 *   get:
 *     summary: Détail d’un fournisseur
 *     tags: [Fournisseurs]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du fournisseur
 */
router.get("/providers/:id", requireLogin, providerControllers.read);
/**
 * @swagger
 * /providers:
 *   post:
 *     summary: Ajoute un fournisseur (admin requis)
 *     tags: [Fournisseurs]
 *     security:
 *       - SessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nom: "Fournisseur X"
 *     responses:
 *       201:
 *         description: Fournisseur ajouté
 */
router.post("/providers", requireAdmin, providerControllers.add);
/**
 * @swagger
 * /providers/{id}:
 *   put:
 *     summary: Modifie un fournisseur (admin requis)
 *     tags: [Fournisseurs]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nom: "Fournisseur Y"
 *     responses:
 *       200:
 *         description: Fournisseur mis à jour
 */
router.put("/providers/:id", requireAdmin, providerControllers.edit);
/**
 * @swagger
 * /providers/{id}:
 *   delete:
 *     summary: Supprime un fournisseur (admin requis)
 *     tags: [Fournisseurs]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Fournisseur supprimé
 */
router.delete("/providers/:id", requireAdmin, providerControllers.destroy);
/**
 * @swagger
 * /provider-types:
 *   get:
 *     summary: Liste les types de fournisseurs
 *     tags: [Fournisseurs]
 *     security:
 *       - SessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des types
 */
router.get('/provider-types', requireLogin, providerControllers.getProviderType);

//Routes pour les stocks
/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Liste le stock
 *     tags: [Stock]
 *     responses:
 *       200:
 *         description: Liste du stock
 */
router.get("/stock", stockControllers.browse);
/**
 * @swagger
 * /stock/categorie:
 *   get:
 *     summary: Stock groupé par catégorie
 *     tags: [Stock]
 *     responses:
 *       200:
 *         description: Stock par catégorie
 */
router.get("/stock/categorie", stockControllers.getStockByCategory);
/**
 * @swagger
 * /stock/low:
 *   get:
 *     summary: Produits en stock faible
 *     tags: [Stock]
 *     responses:
 *       200:
 *         description: Liste des stocks faibles
 */
router.get("/stock/low", stockControllers.getLowStock);
/**
 * @swagger
 * /stock/{productId}:
 *   get:
 *     summary: Détails du stock d’un produit
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock du produit
 */
router.get("/stock/:productId", stockControllers.read);

//Routes pour le passage des commandes
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crée une commande (admin requis)
 *     tags: [Commandes]
 *     security:
 *       - SessionCookieAuth: []
 *     responses:
 *       201:
 *         description: Commande créée
 */
router.post("/orders",requireAdmin, orderControllers.add);
/**
 * @swagger
 * /orders/{id}/status:
 *   get:
 *     summary: Récupère le statut d’une commande
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Statut de la commande
 */
router.get("/orders/:id/status", orderControllers.readStatus);
/**
 * @swagger
 * /orders/{id}/products:
 *   get:
 *     summary: Récupère les produits d’une commande
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produits de la commande
 */
router.get("/orders/:id/products", orderControllers.getProductsFromOrder);
/**
 * @swagger
 * /orders-total:
 *   get:
 *     summary: Récupère les totaux de toutes les commandes
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: Totaux de commandes
 */
router.get("/orders-total", orderControllers.getOrderTotals);
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Récupère une commande
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de la commande
 */
router.get("/orders/:id", orderControllers.read);
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Liste toutes les commandes
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: Liste des commandes
 */
router.get("/orders", orderControllers.readAll);
/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Met à jour une commande (admin requis)
 *     tags: [Commandes]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande mise à jour
 */
router.put("/orders/:id", requireAdmin, orderControllers.update);
/**
 * @swagger
 * /orders/{id}/full:
 *   get:
 *     summary: Récupère une commande complète avec produits
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande complète
 */
router.get("/orders/:id/full", orderControllers.getFullOrder);
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Supprime une commande (admin requis)
 *     tags: [Commandes]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Commande supprimée
 */
router.delete("/orders/:id", requireAdmin, orderControllers.destroy);

//Routes pour les catégories de produits
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Liste les catégories
 *     tags: [Catégories]
 *     security:
 *       - SessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des catégories
 */
router.get("/categories", requireLogin, categoryControllers.browse);
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Détail d’une catégorie
 *     tags: [Catégories]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail de la catégorie
 */
router.get("/categories/:id", requireLogin, categoryControllers.read);
/**
 * @swagger
 * /categories/{id}/providers:
 *   get:
 *     summary: Fournisseurs associés à une catégorie
 *     tags: [Catégories]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des fournisseurs
 */
router.get("/categories/:id/providers", requireLogin, categoryControllers.getProvidersByCategory);
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Ajoute une catégorie (admin requis)
 *     tags: [Catégories]
 *     security:
 *       - SessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nom: "Informatique"
 *     responses:
 *       201:
 *         description: Catégorie créée
 */
router.post("/categories", requireAdmin, categoryControllers.add);
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Modifie une catégorie (admin requis)
 *     tags: [Catégories]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nom: "Nouvelle catégorie"
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 */
router.put("/categories/:id", requireAdmin, categoryControllers.edit);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Supprime une catégorie (admin requis)
 *     tags: [Catégories]
 *     security:
 *       - SessionCookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Catégorie supprimée
 */
router.delete("/categories/:id", requireAdmin, categoryControllers.destroy);

//Routes de tests
router.get("/items", itemControllers.browse);
router.get("/items/:id", itemControllers.read);
router.put("/items/:id", itemControllers.edit);
router.post("/items", itemControllers.add);
router.delete("/items/:id", itemControllers.destroy);

module.exports = router;






