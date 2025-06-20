
# Documentation GitLab CI/CD – Intégration & Pipeline

---

## 1. Présentation Générale

Cette configuration GitLab CI/CD permet d’automatiser les étapes critiques du cycle de vie de développement frontend de ton projet **StockManager**, avec notamment :

- Installation des dépendances
- Exécution des tests unitaires
- Build et push d’une image Docker
- Analyse statique de code avec SonarCloud
- Analyse de sécurité statique (SAST)

L’objectif est de garantir un pipeline automatisé, reproductible, fiable, et intégrable dans une démarche DevOps moderne.

---

## 2. Structure du pipeline GitLab CI/CD

### Stages définis

| Stage   | Description                                         |
|---------|---------------------------------------------------|
| test    | Installation des dépendances + exécution des tests unitaires |
| build   | Construction et publication de l’image Docker du frontend |
| deploy  | (Non défini explicitement ici, mais réservé pour déploiement) |
| sast    | Analyse de sécurité statique (SAST) via template GitLab |
| analyze | Analyse de qualité de code avec SonarCloud         |

---

## 3. Variables globales

- `SONAR_USER_HOME`: Emplacement du cache utilisé par SonarScanner pour optimiser les analyses.
- `GIT_DEPTH: "0"`: Permet de cloner tout l’historique git (toutes les branches), nécessaire pour l’analyse Sonar.

Ces variables sont définies au niveau global pour être accessibles dans tous les jobs.

---

## 4. Description des jobs

### 4.1 `active-job` (Stage: test)

- **Objectif** : Installation des dépendances npm dans le dossier frontend.
- **Image utilisée** : `node:21`
- **Script** :  
  `cd frontend && npm i`

---

### 4.2 `test-unitaire` (Stage: test)

- **Objectif** : Exécuter les tests unitaires frontend.
- **Image utilisée** : `node:21`
- **Script** :
    - `npm install`
    - `npm run test`

---

### 4.3 `build-StockManager` (Stage: build)

- **Objectif** : Construire et publier une image Docker contenant le frontend.
- **Image utilisée** : `docker:24.0.5` avec service `docker:24.0.5-dind` (Docker-in-Docker)
- **Variables spécifiques** :
    - `IMAGE_TAG` : tag de l’image basée sur le registre et la branche
    - `SONAR_USER_HOME`, `GIT_DEPTH` héritées
- **Script** :
    - Authentification Docker au registre GitLab avec `$CI_REGISTRY_USER`
    - Build de l’image via le `Dockerfile` dans `frontend/`
    - Push de l’image construite sur le registre Docker GitLab

---

### 4.4 `sonarcloud-check` (Stage: analyze)

- **Objectif** : Exécuter une analyse qualité de code SonarCloud uniquement sur les branches principales et Merge Requests.
- **Image utilisée** : `sonarsource/sonar-scanner-cli:latest`
- **Cache** : Cache `.sonar/cache` pour optimiser les analyses successives.
- **Script** :
    - Exécution de `sonar-scanner`
- **Déclenchement** : Seulement sur `merge_requests` et `main`.

---

### 4.5 Inclusion de template SAST

- Utilisation du template officiel GitLab `Jobs/SAST.gitlab-ci.yml` pour la phase d’analyse statique de sécurité.
- Ce job permet d’identifier les vulnérabilités dans le code source automatiquement.

---

## 5. Dockerfile Frontend (brief)

\`\`\`dockerfile
FROM nginx
ADD . /usr/share/nginx/html
\`\`\`

- Image nginx utilisée pour servir les fichiers frontend statiques générés.
- Le contenu du frontend est copié dans le dossier racine par défaut d’nginx.

---

## 6. Intérêt de cette intégration dans la démarche DevOps

### Automatisation & Fiabilité

- **Automatisation complète** des étapes critiques (test, build, analyse) assurant une qualité continue.
- Chaque push déclenche un pipeline qui garantit que le code est testé et validé avant d’être intégré.

### Sécurité & Qualité

- **Analyse statique de sécurité (SAST)** détecte automatiquement les vulnérabilités.
- **SonarCloud** assure la qualité du code, couverture des tests, et détection de dettes techniques.

### Déploiement Simplifié

- Construction d’images Docker prêtes à être déployées sur des environnements de test ou production.
- Utilisation des variables et tags pour versionner automatiquement les builds.

### Feedback rapide

- Résultats des tests et analyses visibles directement dans GitLab.
- Permet aux équipes de corriger rapidement les anomalies détectées.

### Scalabilité

- Structure claire avec stages et jobs permet d’ajouter facilement des étapes supplémentaires (tests end-to-end, déploiement).

---

# Conclusion

Cette intégration GitLab CI/CD apporte un contrôle automatisé, robuste et efficace sur le cycle de développement frontend et backend. Elle est un levier majeur dans ta démarche DevOps pour garantir qualité, sécurité et agilité dans les livraisons.
