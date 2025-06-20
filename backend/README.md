
# Documentation Technique & Fonctionnelle - Backend

---

## 1. Présentation Générale

Le backend est une application **Node.js** organisée autour de **Express**, avec une architecture modulaire en contrôleurs, routes, middlewares et services.  
Les points clés :

- Gestion des utilisateurs, produits, fournisseurs, stocks, commandes, catégories, magasins.
- Authentification et gestion de session via `express-session` avec protection CSRF.
- Sécurité avec hashage de mot de passe (bcrypt), middleware de contrôle d’accès (roles).
- Gestion des notifications et alertes (ex : stock faible) en tâche planifiée (cron).
- Documentation et test des API via **Swagger** (accessible sur `/api-docs`).
- Intégration avec une base de données MySQL via un client personnalisé.
- Envoi d’emails (ex : reset mot de passe) via un service mailer.
- Support pour React en mode production avec fallback sur index.html.

---

## 2. Structure des Dossiers et Fichiers

### Fichiers et dossiers principaux

- **app.js**
    - Point d’entrée de l’application Express.
    - Configuration CORS, session, statics, intégration Swagger, routes, serve React en production.

- **router.js**
    - Regroupement des routes, middlewares et import des contrôleurs.

- **controllers/**
    - Regroupe les fichiers de contrôleurs par entité : `userControllers.js`, `productControllers.js`, `orderControllers.js`, etc.
    - Logique métier : création, lecture, mise à jour, suppression (CRUD) des ressources.

- **auth.js**
    - Middleware de hashage de mot de passe (`hashPassword`), vérification (`verifyPassword`), et protection des routes (`requireLogin`, `requireAdmin`).

- **src/cron/**
    - Scripts pour tâches planifiées, comme l’envoi d’alertes sur stock faible (`stockAlertCron.js`).

- **src/utils/mailer.js**
    - Service d’envoi d’emails utilisé notamment pour la réinitialisation de mot de passe.

- **swaggerConfig.js**
    - Configuration Swagger pour la génération automatique de la documentation API.

- **database/**
    - Client SQL pour les requêtes MySQL.

---

## 3. Fonctionnalités Fonctionnelles

### Authentification & Gestion des Sessions

- Inscription utilisateur avec hashage sécurisé (bcrypt).
- Login avec vérification du mot de passe et création de session.
- Middleware pour sécuriser l’accès aux routes selon le rôle (admin, employé, responsable).
- Gestion des sessions via cookie sécurisé et politique CORS adaptée.
- Déconnexion avec destruction de session et nettoyage du cookie.

### Gestion Utilisateurs

- CRUD complet des utilisateurs avec gestion des rôles.
- Récupération de session active pour maintenir l’état utilisateur frontend.
- Réinitialisation de mot de passe :
    - Génération d’un token sécurisé avec expiration.
    - Envoi d’email avec lien de reset.
    - Mise à jour sécurisée du mot de passe après validation du token.

### Gestion Produits, Fournisseurs, Stocks et Commandes

- Gestion complète CRUD pour chaque entité avec validations.
- Pagination, filtres et recherche via paramètres d’API.
- Gestion des catégories et magasins associés.
- Surveillance du stock avec alertes envoyées automatiquement.
- Gestion des commandes avec statuts, ajout/modification dynamique.

### Notifications

- Système d’envoi d’emails pour alertes et notifications diverses.
- Test de notification via endpoint dédié.

---

## 4. Aspects Techniques

- **Framework :** Express.js avec architecture MVC simplifiée.
- **Base de données :** MySQL, interaction via client personnalisé (`database/client.js`).
- **Sécurité :**
    - Hashage des mots de passe avec bcrypt.
    - Middleware d’autorisation basé sur session et rôle utilisateur.
    - Protection CSRF intégrée via middleware `csurf`.
- **Sessions :** Gestion via `express-session` avec cookie sécurisé et durée configurable.
- **CORS :** Configuré pour autoriser le frontend (par défaut `http://localhost:5173`).
- **Documentation :** API documentée avec Swagger accessible sur `/api-docs`.
- **Emails :** Envoi via Nodemailer configuré avec SMTP.
- **Tâches planifiées :** Utilisation de scripts cron pour alertes et maintenance.
- **Serveur statique :** Sert les ressources publiques et l’application React en production.

---

## 5. Exemple de Flux d’Utilisation

1. **Inscription** : L’utilisateur s’inscrit, mot de passe hashé, utilisateur créé en base.
2. **Connexion** : L’utilisateur se connecte, mot de passe vérifié, session créée.
3. **Session** : Vérification permanente de la session lors des appels API protégés.
4. **Utilisation** : Accès aux ressources produits, fournisseurs, commandes selon rôle.
5. **Mot de passe oublié** : Demande de réinitialisation, email envoyé avec token.
6. **Réinitialisation** : Nouveau mot de passe validé via token sécurisé.
7. **Alertes stock** : Cron envoie des emails si le stock est faible.
8. **Déconnexion** : Session détruite, cookie nettoyé.

---

## 6. À Améliorer / Évolutions Possibles

- Passage à JWT pour authentification sans session côté serveur.
- Ajout de tests unitaires et d’intégration (Jest, supertest).
- Amélioration des validations (express-validator).
- Intégration WebSocket pour notifications temps réel.
- Gestion multi-langue (i18n) et internationalisation des emails.
- Optimisation du code avec TypeScript.
- Documentation Swagger enrichie et exemples d’usage.
- Mise en place de CI/CD avec tests et déploiement automatisés.

---
