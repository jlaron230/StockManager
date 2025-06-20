# Documentation Technique & Fonctionnelle - Frontend

---

## 1. Présentation Générale

Le frontend est une application **React** organisée autour de composants fonctionnels, utilisant principalement :

- **React hooks** (`useState`, `useEffect`, `useRef`) pour la gestion d’état et effets.
- **Tailwind CSS** pour la mise en forme responsive et le design moderne.
- **Axios** et `fetch` pour la communication avec un backend REST, avec gestion de la session via cookies.
- Un système de gestion des droits utilisateurs (Admin, Responsable, Employé).
- Un ensemble de pages et composants couvrant la gestion utilisateurs, produits, fournisseurs, commandes, tableau de bord, et effets visuels.

---

## 2. Structure des Dossiers et Fichiers

### Composants clés (extraits)

- **UserSection.jsx**
    - Gestion complète des utilisateurs : affichage, création, modification, suppression.
    - Intègre la récupération de la session et gestion des droits.
    - Composants internes : tableau d’utilisateurs avec gestion des effets de scroll.

- **ImageEffect.jsx**
    - Composant d’affichage d’une image principale avec miniatures cliquables.
    - Utilise `useState` pour gérer l’image sélectionnée.

- **Dashboard.jsx**
    - Affiche un résumé global (statistiques, alertes).
    - Différenciation UI selon rôle utilisateur (admin ou simple utilisateur).

- **ProductList.jsx, ProductForm.jsx**
    - Liste des produits avec filtres et pagination.
    - Formulaire d’ajout / modification produit, gestion d’upload image.

- **ProviderList.jsx, ProviderForm.jsx**
    - Liste et gestion des fournisseurs.
    - Formulaire CRUD similaire aux produits.

- **OrderList.jsx, OrderForm.jsx**
    - Gestion des commandes : affichage, création, modification, suppression.

---

## 3. Fonctionnalités Fonctionnelles

### Gestion Utilisateurs

- Récupération de la liste via API avec filtres.
- Création utilisateur avec formulaire validé.
- Modification et suppression avec confirmation.
- Gestion dynamique du tableau avec effets visuels (scroll et animations).
- Droits d’accès en frontend basés sur rôle récupéré dans la session.

### Gestion Produits

- Affichage paginé et filtré.
- Formulaire contrôlé avec upload d’image.
- Modification et suppression.
- Rafraîchissement dynamique de la liste après modification.

### Gestion Fournisseurs

- Liste et détails.
- CRUD complet avec formulaires.
- Liaison avec les produits et commandes.

### Gestion Commandes

- Liste des commandes avec statuts.
- Formulaire de création avec ajout dynamique de lignes.
- Modification des statuts.
- Suppression avec confirmation.

### Dashboard

- Vue personnalisée selon rôle.
- Statistiques globales et notifications.
- Composants graphiques réactifs.

---

## 4. Aspects Techniques

- **State Management** :  
  Local avec hooks, possibilité d’évolution vers Context API ou Redux.

- **API Communication** :
    - Axios avec `withCredentials` pour gestion des cookies de session.
    - Gestion des erreurs et retours utilisateur via toasts/messages inline.

- **Sécurité & Droits** :  
  Contrôle frontend basé sur les rôles utilisateur (extraits de la session).

- **UI/UX** :
    - Utilisation poussée de **Tailwind CSS** pour design moderne, responsive et modulable.
    - Gestion des états et interactions via classes Tailwind (ex : hover, focus, transition-transform).
    - Animation CSS pour effets sur scroll et interactions utilisateur.
    - Modals et composants réutilisables stylisés avec Tailwind.

- **Gestion d’image** :  
  Upload avec preview dans les formulaires (produits, etc).

- **Optimisations** :
    - Rechargement intelligent des données après actions.
    - Mise en place d’effets visuels et retour utilisateur en temps réel.

---

## 5. Tests Unitaires

- Utilisation de **Jest** comme framework de test unitaire.
- Tests réalisés principalement sur :
    - Composants React critiques (ex : formulaires produits).
    - Fonctions utilitaires liées à la gestion d’état et transformation des données.
- Tests couvrant :
    - Rendu correct des composants.
    - Interaction utilisateur (click, sélection).
    - Gestion des erreurs.
- Mise en place possible de tests avec **React Testing Library** pour simuler le DOM et les événements.
- Intégration dans la CI/CD pour exécution automatique des tests.

---

## 6. Points à Améliorer / Évolution

- Passage à un état global pour éviter le "prop drilling" à l’échelle.
- Extension des tests unitaires et ajout de tests d’intégration.
- Intégration de WebSocket ou polling pour notifications temps réel.
- Meilleure gestion des erreurs API avec messages plus explicites.
- Documentation des composants et hooks internes.
- Ajout de l’internationalisation (i18n).

---

## 7. Exemple de Flux d’Utilisation

1. **Connexion** : Utilisateur se connecte, session récupérée via API.
2. **Affichage Dashboard** : Contenu adapté selon rôle.
3. **Gestion Utilisateurs** (si admin) : consultation liste, ajout via modal, modification, suppression.
4. **Gestion Produits/Fournisseurs** : CRUD complet avec feedbacks.
5. **Création Commandes** : sélection produits et fournisseurs, validation.
6. **Visualisation / modification commandes** avec mises à jour en temps réel.
7. **Déconnexion** sécurisée.

---
