
# Manuel d'Utilisation - Application StockManager

## Introduction
StockManager est une application web de gestion de stock qui inclut des fonctionnalités pour gérer les utilisateurs, produits, fournisseurs, commandes, et plus encore. Ce manuel décrit les principales fonctionnalités, ainsi que les aspects techniques pour les développeurs et administrateurs.

---

## 1. Fonctionnalités Principales

### Gestion des Utilisateurs
- Inscription et connexion sécurisées avec hashage des mots de passe (bcrypt).
- Gestion des rôles : utilisateur standard, employé, responsable, administrateur.
- Gestion des sessions avec authentification et autorisation.
- Fonctionnalités de réinitialisation de mot de passe via email sécurisé.

### Gestion des Produits et Stocks
- Création, modification, suppression des produits et fournisseurs.
- Suivi des niveaux de stock avec alertes sur les faibles quantités.
- Historique des commandes et mouvements de stock.

### Interface Utilisateur
- Frontend en React avec affichage dynamique des images et informations produits.
- Intégration avec backend Express.js pour une API REST sécurisée.
- Documentation API générée avec Swagger accessible via `/api-docs`.

---

## 2. Aspects Techniques

### Backend
- Utilisation de Node.js et Express.js.
- Base de données SQL gérée via un ORM maison (modèles et managers).
- Middleware pour gestion des sessions et sécurité (CSRF, JWT, rôles).
- Tâches planifiées pour alertes stock avec cron jobs.

### Frontend
- Projet React organisé avec composants modulaires.
- Intégration continue avec GitLab CI/CD :
    - Stages : test, build, deploy, sécurité (SAST), analyse qualité.
    - Utilisation de Docker pour build et déploiement.
    - Intégration SonarCloud pour analyse de code.
- Utilisation de Tailwind CSS pour le style.

### Sécurité
- Hashage des mots de passe avec bcrypt.
- Protection des routes sensibles avec middleware `requireLogin` et `requireAdmin`.
- Gestion sécurisée des sessions via `express-session`.
- Réinitialisation mot de passe sécurisée avec token unique et expiration.

### Déploiement
- Pipeline GitLab CI/CD configuré avec les étapes :
    - Installation des dépendances, tests unitaires.
    - Build Docker de l’image frontend.
    - Déploiement automatisé.
- Configuration du serveur NGINX pour servir la partie frontend React.
- Documentation Swagger pour les API.

---

## 3. Utilisation

### Inscription & Connexion
- L'utilisateur peut s'inscrire via l'API `registerUser`.
- La connexion vérifie le mot de passe, crée une session utilisateur.
- Les rôles sont utilisés pour gérer les accès aux différentes ressources.

### Réinitialisation de Mot de Passe
- L'utilisateur peut demander un email de réinitialisation via `forgotPassword`.
- Un token est généré, stocké et envoyé par mail.
- L'utilisateur peut modifier son mot de passe via `resetPassword`.

### Gestion des Stocks
- Les alertes sont automatiquement générées pour les stocks faibles.
- L'interface affiche les images des produits avec un composant React dédié.

---

## 4. Développement & Maintenance

### Architecture du Code
- Backend organisé en contrôleurs, modèles, routes, middlewares.
- Frontend avec composants React et gestion d’état via hooks (`useState`).
- Tests unitaires et scripts d’installation automatisés.

### Commandes Utiles
- `npm install` dans `frontend` pour installer les dépendances.
- `npm run test` pour lancer les tests.
- Pipelines GitLab pour automatiser build et déploiement.

### Variables d’Environnement
- `SESSION_SECRET` pour sécuriser les sessions.
- `FRONTEND_URL` pour la configuration CORS et liens mails.
- Credentials Docker pour le déploiement.

---

## 5. Notes Complémentaires
- Toute modification du code doit respecter les normes de sécurité et bonnes pratiques.
- Consulter la documentation Swagger pour toutes les routes API disponibles.
- Le frontend React est compilé dans le dossier `frontend/dist` pour production.

---

## 6. Support
Pour toute question ou problème, contacter l’administrateur système ou consulter le README du projet.

---