
# GeStock Manager - Application Mobile

GeStock Manager est une application mobile de gestion de stock destinée aux commerces. Elle permet de gérer les produits, fournisseurs, commandes et utilisateurs depuis une interface simple, responsive et accessible.

## Technologies utilisées

- **React Native** avec **Expo** (SDK 50)
- **Node.js** (v18+)
- **TailwindCSS** pour le responsive design via `nativewind`
- **Jest** pour les tests
- **SonarCloud** pour l’analyse de la qualité du code
- **GitLab CI/CD** pour le déploiement continu

## Fonctionnalités principales

- Authentification sécurisée par sessions
- Gestion des produits (CRUD)
- Suivi des fournisseurs et des commandes
- Responsive design mobile-first
- Accessibilité améliorée (balises ARIA, contraste, structure logique)

## Installation

1. Cloner le dépôt :
   ```bash
   git clone git@gitlab.com:test2360711/gestockmanager-desktop.git
   cd StockManagerMobile
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Lancer le projet :
   ```bash
   npx expo start
   ```

## Build de production

Pour générer l’APK Android avec EAS Build :
```bash
npx eas build -p android --profile preview
```

> Remarque : nécessite un compte Expo connecté avec `npx expo login`

## Débogage - erreur Kotlin (si crash de l'APK)

Si vous obtenez une erreur du type :

```
No direct method <init>(...) in class expo.modules.kotlin.classcomponent.ClassComponentBuilder
```

Essayez les étapes suivantes :

```bash
# Nettoyage manuel
rm -rf node_modules android .expo
rm yarn.lock
npm cache clean --force

# Réinstallation
yarn install
npx expo prebuild
npx expo run:android
```

## Accessibilité

L’application a été développée avec une attention particulière à l’accessibilité :

- Titres et sous-titres bien hiérarchisés
- Utilisation de `aria-label` pour les éléments interactifs
- Balises `alt` pour les images
- Contraste adapté pour garantir la lisibilité
- Navigation simplifiée

## Responsive Design

L’interface s’adapte automatiquement aux tailles d’écrans grâce à :

- Tailwind CSS avec `nativewind`
- Flexbox et `ScrollView` pour les zones dynamiques
- Icônes vectorielles (`react-native-vector-icons`)

## Tests

```bash
npm test
```

Tests unitaires réalisés avec Jest.

## Auteur

Ce projet a été réalisé par [Mael et Jérôme], dans le cadre du titre professionnel **Concepteur Développeur d'Applications**.

---

**StockManagerMobile - 2025**
