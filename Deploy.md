
# Documentation de déploiement – Application StockManager

## 1. Prérequis au déploiement

### Backend (Node.js / Express)

- Node.js version >= 18.x
- Base de données MySQL
- Système de session via `express-session`
- Fichier `.env` requis :
  ```env
  APP_PORT=5000
  FRONTEND_URL=http://localhost:5173

  DB_HOST=mysql-xxx.alwaysdata.net
  DB_PORT=3306
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_NAME=stockmanager

  SESSION_SECRET=unePhraseSecrèteComplexe123!
  ```
  
- Ajouter le fichier de configuration Firebase en créant un nouveau dossier dans le `/backend` : 
crée un nouveau fichier : `firebaseKey.json`

 ```firebaseKey.json 
 {
"type": "service_account",
"project_id": "ton-project-id",
"private_key_id": "ta-private-key-id",
"private_key": "-----BEGIN PRIVATE KEY-----\nTA_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n",
"client_email": "firebase-adminsdk@ton-project-id.iam.gserviceaccount.com",
"client_id": "ton-client-id",
"auth_uri": "https://accounts.google.com/o/oauth2/auth",
"token_uri": "https://oauth2.googleapis.com/token",
"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk@ton-project-id.iam.gserviceaccount.com",
"universe_domain": "googleapis.com"
}
  ```


configurer le fichier `firebase.js` dans le même dossier :

  ```firebase.js
const admin = require("firebase-admin"); // Import du SDK Firebase Admin
const serviceAccount = require("./firebaseKey.json"); // Import des clés de service Firebase

// Initialisation de l'application Firebase Admin avec les identifiants de service
admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
});

module.exports = admin; // Export de l'instance Firebase Admin pour utilisation dans d'autres fichiers
  ```

### Frontend (React + Vite)

- Node.js version >= 18.x
- Fichier `.env` requis :
  ```env
  VITE_BACKEND_URL=http://localhost:5000
  ```

---

## 2. Étapes d’installation locale

### Clonage du dépôt
```bash
git clone git@gitlab.com:test2360711/gestockmanager-desktop.git
cd stockmanager
```

### Installation des dépendances
```bash
npm install

cd backend
npm install

cd ../frontend
npm install
```

### Configuration des fichiers `.env`
Créer les fichiers `.env` dans `backend/` et `frontend/` à partir des exemples fournis (`.env.example`).

---

## 3. CI/CD – Intégration et déploiement continu avec GitLab

Le fichier `.gitlab-ci.yml` du projet automatise les étapes suivantes :

###  1. **Test des dépendances**
```yaml
active-job:
  stage: test
  image: node:21
  script: cd frontend && npm i
```

###  2. **Tests unitaires**
```yaml
test-unitaire:
  stage: test
  image: node:21
  script:
    - npm install
    - npm run test
```

### 3. **Build et déploiement Docker du frontend**
```yaml
build-StockManager:
  stage: build
  image: docker:24.0.5
  services:
    - docker:24.0.5-dind
  script:
    - echo "$CI_REGISTRY_PASSWORD" | docker login $CI_REGISTRY -u $CI_REGISTRY_USER --password-stdin
    - docker build -f frontend/Dockerfile -t $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG frontend
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG
```

### 4. **Analyse de code avec SonarCloud**
```yaml
sonarcloud-check:
  stage: analyze
  image: sonarsource/sonar-scanner-cli:latest
  entrypoint: [""]
  cache:
    key: "${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  script:
    - sonar-scanner
  only:
    - merge_requests
    - main
```

### 5. **Sécurité statique (SAST)**
Inclus via template GitLab :
```yaml
include:
  - template: Jobs/SAST.gitlab-ci.yml
```

---

## 4. Déploiement Docker (local ou production simulée)

Créer un fichier `docker-compose.yml` :
```yaml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    env_file:
      - ./backend/.env

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    env_file:
      - ./frontend/.env
```

Lancer les services :
```bash
docker-compose up --build
```

---

## 5. Sécurité et bonnes pratiques

- Utilisation de `express-session` avec secret robuste
- Rôles `admin` / `user` pour limiter les accès
- Fichiers `.env` non versionnés (`.gitignore`)
- Analyse de code et tests automatisés dans GitLab CI
- Préparation pour un déploiement HTTPS futur

---

## 6. Notes complémentaires

- Le déploiement réel n’a **pas été exécuté** dans ce projet, mais tous les éléments sont prêts pour :
    - un hébergement **Render / Railway / Heroku** (backend)
    - un hébergement **Vercel / Netlify** (frontend)
- Les pipelines GitLab simulent déjà les étapes CI (tests), CD (build) et contrôle de qualité

---

## 📎 Fichiers utiles à ajouter au dépôt

### `.env.example` (Backend)
```env
APP_PORT=5000
FRONTEND_URL=http://localhost:5173

DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=

SESSION_SECRET=
```

### `.env.example` (Frontend)
```env
VITE_BACKEND_URL=http://localhost:5000
```
