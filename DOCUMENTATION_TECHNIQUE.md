# Documentation Technique du Projet : TruthLens

**Version :** 1.0  
**Date :** 03 Juillet 2025

---

## 1. Introduction

### 1.1 Contexte du Projet
Dans un écosystème médiatique de plus en plus fragmenté, la désinformation sur les réseaux sociaux est un enjeu majeur. Le projet **TruthLens** a été conçu pour fournir aux utilisateurs un outil d'analyse critique du contenu sur la plateforme émergente **Bluesky**.

### 1.2 Objectifs
L'objectif principal de TruthLens est de permettre une évaluation rapide et nuancée de la fiabilité et du ton des publications et des profils sur Bluesky. Les objectifs spécifiques sont :
- **Analyser la fiabilité d'un post** : Fournir un score de fiabilité basé sur une analyse par intelligence artificielle.
- **Analyser le profil d'un utilisateur** : Agréger les analyses de plusieurs posts pour dresser un portrait général de la fiabilité et des thèmes abordés par un utilisateur.
- **Identifier les émotions** : Détecter les émotions principales véhiculées par un post ou un profil.
- **Classifier le contenu** : Déterminer si un contenu est de nature politique ou factuelle.
- **Fournir une interface utilisateur simple et intuitive** pour accéder à ces analyses.

---

## 2. Architecture Technique

### 2.1 Schéma de l'Architecture
L'application est basée sur une architecture client-serveur classique, décomposée en trois services principaux gérés par Docker.

```
      +-------------------------+
      |     Utilisateur         |
      |   (Navigateur Web)      |
      +-----------+-------------+
                  |
                  | (HTTPS / Port 3000)
                  v
      +-------------------------+
      |   Front-end (React)     |
      | (Service Docker)        |
      +-----------+-------------+
                  |
                  | (API REST / Port 5000)
                  v
      +-------------------------+
      |    Back-end (Flask)     |
      | (Service Docker)        |
      +-----------+-------------+
                  |
                  |
+-----------------+-----------------+
|                 |                 |
v                 v                 v
+---------------+ +---------------+ +----------------+
|  API Bluesky  | | API Gemini (IA)| |   BDD MySQL    |
|  (atproto)    | | (Google AI)   | | (Service Docker) |
+---------------+ +---------------+ +----------------+
```

### 2.2 Choix Techniques et Technologies

- **Front-end** :
    - **Framework** : **React.js**. Choisi pour son écosystème robuste, sa performance grâce au DOM virtuel, et sa capacité à créer des interfaces utilisateur dynamiques et réactives ainsi qu'une maitrise du framework par les membres du groupe.
    - **Communication API** : **Axios** est utilisé pour effectuer les requêtes HTTP vers le back-end de manière simple et efficace.

- **Back-end** :
    - **Framework** : **Flask (Python)**. Sélectionné pour sa légèreté, sa simplicité et sa flexibilité, ce qui est idéal pour créer une API RESTful rapidement.
    - **Communication Cross-Origin** : **Flask-CORS** est utilisé pour gérer les autorisations CORS, permettant au front-end React de communiquer avec l'API.

- **Logique d'Analyse et IA** :
    - **Intégration Bluesky** : La bibliothèque Python **`atproto`** est utilisée pour interagir avec l'API de Bluesky, permettant de récupérer les posts et les informations de profil de manière authentifiée.
    - **Intelligence Artificielle** : L'API **Google Gemini (gemini-1.5-flash-latest)** est au cœur de l'analyse. Elle est utilisée pour :
        - Évaluer le pourcentage de "fake news" pour calculer un score de fiabilité.
        - Détecter les émotions.
        - Classifier le contenu (politique, factuel).
        - Générer des résumés de profils et de tendances.

- **Base de Données** :
    - **SGBD** : **MySQL**. Une base de données relationnelle classique, prévue initialement pour la gestion des comptes utilisateurs (fonctionnalité actuellement désactivée dans l'interface).

- **Déploiement et Environnement** :
    - **Conteneurisation** : **Docker** et **Docker Compose**. Utilisés pour créer un environnement de développement et de déploiement cohérent, portable et isolé pour les trois services (front-end, back-end, base de données).

### 2.3 Justification des Choix Technologiques

Cette section détaille les raisons qui ont motivé nos choix technologiques, en les comparant à d'autres alternatives pertinentes dans le contexte du projet.

#### **Front-end : React.js**
- **Alternative envisagée :** Angular, Vue.js.
- **Critères de comparaison :**
    - **Performance & Écosystème :** React offre un écosystème très riche et une performance solide.
    - **Facilité d'utilisation :** La courbe d'apprentissage de React est considérée comme plus accessible pour une équipe ayant déjà des bases en JavaScript.
    - **Flexibilité :** React est une bibliothèque qui offre plus de flexibilité pour choisir les outils complémentaires.
- **Pertinence :** Pour une application monopage (SPA) comme TruthLens, la réactivité de React était idéale. La maîtrise préalable de cette technologie par l'équipe a également été un facteur décisif.

#### **Back-end : Flask (Python)**
- **Alternative envisagée :** Django (Python), Node.js (avec Express).
- **Critères de comparaison :**
    - **Légèreté vs. Complet :** Flask est un micro-framework minimaliste, très léger et flexible. Django, plus lourd, inclut des fonctionnalités qui n'étaient pas nécessaires pour notre API simple.
    - **Performance :** Pour une application dont la charge est liée aux appels d'API externes, Node.js aurait été performant. Cependant, l'écosystème Python pour l'IA est bien plus mature.
- **Pertinence :** Le choix de Python était une évidence pour se connecter aux bibliothèques d'analyse et à l'API Gemini. La légèreté de Flask était parfaitement adaptée à notre besoin.

#### **Intelligence Artificielle : Google Gemini**
- **Alternative envisagée :** Entraînement d'un modèle local, modèles open-source (ex: Llama), API OpenAI (GPT-4), API Perplexity.
- **Critères de comparaison :**
    - **Coût et Accessibilité :** Dans le cadre d'un projet étudiant, le coût est un facteur critique. L'API Gemini offre un excellent rapport performance/coût, et surtout, met à disposition **300$ de crédits gratuits**, ce qui a été déterminant. Les API d'OpenAI ou de Perplexity, bien que performantes, n'offraient pas un accès gratuit aussi avantageux.
    - **Facilité d'intégration :** La bibliothèque cliente de Google pour Python est simple et bien documentée.
    - **Performance et Flexibilité :** Le modèle `gemini-1.5-flash-latest` est optimisé pour la vitesse et capable de gérer des tâches complexes comme la génération de résumés.
    - **Expérimentation locale :** Une tentative d'entraînement d'un modèle de classification plus petit en local a été menée. Cependant, les résultats n'étaient pas satisfaisants : la précision était faible, le modèle était très contraint sur le format de sortie (ne parlant pas toujours français) et incapable de générer des résumés textuels de qualité.
    - **Modèles open-source :** Les modèles open-source plus larges (type Llama) auraient nécessité une infrastructure d'hébergement complexe et coûteuse.
- **Pertinence :** Gemini a été choisi pour sa simplicité d'intégration, sa rapidité, sa flexibilité et surtout son coût nul pour le projet grâce aux crédits offerts, offrant un bien meilleur compromis que les alternatives.

#### **Conteneurisation : Docker & Docker Compose**
- **Alternative envisagée :** Déploiement manuel, Kubernetes.
- **Critères de comparaison :**
    - **Simplicité vs. Complexité :** Le déploiement manuel est source d'erreurs. Kubernetes est une solution trop complexe pour un projet de cette taille.
    - **Portabilité et Isolation :** Docker garantit que l'environnement de développement est identique à celui de production. Docker Compose simplifie la gestion des multiples conteneurs.
- **Pertinence :** Docker Compose représente le juste milieu parfait pour ce projet, offrant les avantages de la conteneurisation avec une configuration simple.

#### **Retour d'expérience et Veille Technologique**
L'utilisation de ces technologies a confirmé leur pertinence. Un point d'amélioration futur serait d'explorer la parallélisation des appels à l'API Gemini dans l'analyse de profil pour réduire le temps d'attente. La veille technologique indique que les modèles d'IA deviennent de plus en plus rapides et spécialisés, ce qui pourrait permettre à l'avenir d'utiliser des modèles plus petits et moins coûteux pour des tâches spécifiques.

---

## 3. Fonctionnalités

### 3.1 Analyse d'un Post Unique
- **Description** : L'utilisateur soumet l'URL d'un post Bluesky. Le système récupère le contenu du post, l'analyse via l'IA et affiche un rapport détaillé.
- **Implémentation** :
    1. Le front-end envoie l'URL à l'endpoint `/vet/post` de l'API Flask.
    2. Le back-end utilise `utils.get_bluesky_post_info` pour récupérer les détails du post et de l'auteur.
    3. Le texte du post est envoyé à Gemini pour analyse.
    4. La réponse de l'IA (fiabilité, émotions, etc.) est formatée en JSON et renvoyée au front-end.
    5. Le front-end affiche les résultats dans une carte stylisée.

### 3.2 Analyse d'un Profil
- **Description** : L'utilisateur soumet le handle d'un profil Bluesky. Le système analyse un échantillon des posts récents de ce profil pour en déduire des statistiques et des tendances générales.
- **Implémentation** :
    1. Le front-end envoie le handle à l'endpoint `/vet/account`.
    2. Le back-end récupère les derniers posts de l'utilisateur via `utils.get_authenticated_bluesky_posts`.
    3. Une boucle analyse chaque post individuellement via l'API Gemini.
    4. Les résultats sont agrégés : calcul de la moyenne de fiabilité, comptage des émotions les plus fréquentes, calcul des ratios de contenu politique/factuel.
    5. Un résumé global des thèmes abordés par le profil est généré par un appel final à Gemini.
    6. Si aucune émotion commune n'est trouvée, un mécanisme de secours analyse l'ensemble des textes pour en extraire les 1-2 émotions dominantes.
    7. Les statistiques agrégées sont renvoyées au front-end pour affichage.

### 3.3 Analyse de Tendance (Fonctionnalité de back-end)
- **Description** : Analyse un grand nombre de posts d'un flux populaire (par défaut "What's Hot") pour générer un résumé des sujets tendances.
- **Implémentation** :
    1. L'endpoint `/vet/trend` est appelé.
    2. Le back-end récupère un grand nombre de posts du flux spécifié.
    3. L'ensemble des textes est concaténé et envoyé à Gemini avec un prompt demandant une synthèse des tendances.
    4. Le résumé généré est retourné.

---

## 4. Tests

### 4.1 Stratégie de Test
La stratégie de test repose principalement sur des **tests manuels et des tests d'intégration unitaires** pour le back-end.

### 4.2 Tests du Back-end
- **Fichier de test** : `back-end/manual_tests.py`.
- **Objectif** : Ce script permet de tester chaque fonctionnalité d'analyse de manière isolée, directement depuis le terminal, sans dépendre du front-end.
- **Procédure** : Le développeur peut décommenter les fonctions de test (`test_analyse_compte`, `test_analyse_post`, `test_analyse_tendance`) et les exécuter. La sortie JSON est affichée dans la console, permettant de valider :
    - La connectivité avec les API externes (Bluesky, Gemini).
    - Le format et la pertinence des données retournées.
    - La performance des fonctions d'analyse.

### 4.3 Tests du Front-end
- Les tests du front-end sont effectués **manuellement** en interagissant avec l'interface utilisateur dans un navigateur.
- Les scénarios testés incluent :
    - La soumission de handles et d'URL valides et invalides.
    - La gestion des états de chargement (`loading`).
    - L'affichage correct des messages d'erreur retournés par l'API.
    - La réactivité de l'interface sur différentes tailles d'écran.

### 4.4 Validation des Performances
- **Analyse de post** : La performance est quasi-instantanée, dépendant principalement du temps de réponse de l'API Gemini (généralement < 2 secondes).
- **Analyse de profil** : La performance est plus lente car elle implique de multiples appels séquentiels à l'API Gemini. Pour un échantillon de 50 posts, le temps d'analyse peut varier de 15 à 40 secondes. Ce point est une piste d'amélioration potentielle (parallélisation des appels).

---

## 5. Documentation Utilisateur

### 5.1 Guide d'Installation
Pour lancer le projet en local, suivez ces étapes :

1.  **Prérequis** :
    - Docker
    - Docker Compose
    - Git

2.  **Clonage du Dépôt** :
    ```bash
    git clone <URL_DU_DEPOT>
    cd truthlens
    ```

3.  **Configuration de l'Environnement** :
    - Créez un fichier `.env` dans le dossier `back-end/`.
    - Ajoutez les clés d'API nécessaires dans ce fichier :
      ```
      API_KEY="VOTRE_CLE_API_GOOGLE_GEMINI"
      BLUESKY_HANDLE="VOTRE_HANDLE_BLUESKY"
      BLUESKY_APP_PASSWORD="VOTRE_MOT_DE_PASSE_D_APPLICATION_BLUESKY"
      PROMPT_PART1=... (conserver la valeur existante si fournie)
      PROMPT_PART2=... (conserver la valeur existante si fournie)
      ```

4.  **Lancement de l'Application** :
    - À la racine du projet, exécutez la commande :
      ```bash
      docker-compose up --build
      ```

5.  **Accès à l'Application** :
    - Ouvrez votre navigateur et allez à l'adresse : `http://localhost:3000`

### 5.2 Guide d'Utilisation

- **Analyser un Post** : Sur la page d'accueil ("Posts"), collez l'URL complète d'un post Bluesky dans le champ de saisie et cliquez sur "Analyser".
- **Analyser un Profil** : Cliquez sur l'onglet "Profils". Entrez le handle d'un utilisateur (ex: `nasa.bsky.social` ou `@nasa.bsky.social`) et cliquez sur "Analyser".
- **Analyser les Tendances** : Cliquez sur l'onglet "Tendances" puis sur "Analyser les tendances". Le système analysera les posts populaires et affichera un résumé des sujets en vogue.

### 5.3 Foire Aux Questions (FAQ)

- **Q : Pourquoi l'analyse d'un profil est-elle parfois longue ?**
  - **R :** L'analyse de profil examine plusieurs dizaines de posts un par un. Chaque post nécessite un appel à une intelligence artificielle, ce qui prend du temps.

- **Q : Le score de fiabilité est-il une vérité absolue ?**
  - **R :** Non. Le score est une estimation générée par une IA. Il doit être utilisé comme un indicateur pour encourager la vigilance, et non comme un jugement définitif.

- **Q : Pourquoi certaines analyses de profil ne montrent-elles aucune émotion ?**
  - **R :** Si le contenu d'un utilisateur est très neutre ou varié, il se peut qu'aucune émotion ne soit détectée comme étant dominante. Dans ce cas, le système effectue une seconde analyse globale pour tenter d'en trouver, mais si le résultat est toujours non concluant, un message l'indiquera.
