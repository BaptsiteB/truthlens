# API d'Analyse de Contenu Bluesky

Cette API fournit des outils pour analyser le contenu du réseau social Bluesky. Elle permet d'évaluer des posts, des comptes utilisateurs et des tendances générales à l'aide de l'IA de Google (Gemini).

## Installation et Lancement

1.  **Prérequis :** Python 3 et pip installés.

2.  **Installation des dépendances :**
    Assurez-vous d'être dans le dossier `back-end-refacto` et exécutez :
    ```sh
    pip install -r requirements.txt
    ```

3.  **Configuration de l'environnement :**
    Renommez le fichier `.env.example` en `.env` et remplissez les variables nécessaires :
    - `API_KEY`: Votre clé d'API pour Google Gemini.
    - `BLUESKY_HANDLE`: Votre nom d'utilisateur Bluesky (ex: `moncompte.bsky.social`).
    - `BLUESKY_APP_PASSWORD`: Un mot de passe d'application généré depuis les paramètres de Bluesky.

4.  **Lancement de l'API :**
    ```sh
    python api.py
    ```
    Le serveur sera accessible à l'adresse `http://127.0.0.1:5000`.

## Description des Fichiers

- **`api.py`**: Le point d'entrée de l'API. Il utilise Flask pour créer les routes et gérer les requêtes HTTP.
- **`account_analysis.py`**: Contient la logique pour analyser un compte Bluesky. Il normalise les entrées, récupère les posts et agrège les analyses.
- **`post_analysis.py`**: Contient la logique pour analyser un post unique. Il vérifie la validité de l'URL et la présence de texte avant l'analyse.
- **`trend_analysis.py`**: Contient la logique pour analyser une tendance à partir d'un flux Bluesky (par exemple, "What's Hot").
- **`utils.py`**: Fichier utilitaire regroupant toutes les fonctions de communication avec les API externes (Bluesky et Google Gemini).
- **`manual_tests.py`**: Un script simple pour tester manuellement les fonctions principales sans passer par l'API.
- **`requirements.txt`**: Liste les dépendances Python nécessaires au projet.
- **`.env`**: Fichier de configuration pour les clés d'API et les identifiants (doit être créé à partir de `.env.example`).

---

## Spécifications de l'API

### Analyser un Post

- **Route :** `/vet/post`
- **Méthode :** `POST`
- **Description :** Analyse le contenu textuel d'un post Bluesky.
- **Corps de la requête (JSON) :**
  ```json
  {
      "url": "https://bsky.app/profile/HANDLE/post/RKEY"
  }
  ```
- **Réponse (Succès - 200 OK) :**
  ```json
  {
      "post": "Texte du post...",
      "auteur": "handle.bsky.social",
      "cree_le": "2024-01-01T12:00:00.000Z",
      "estPolitique": false,
      "contientInformationFactuelle": true,
      "emotions": ["Joie", "Confiance"],
      "pourcentageFakeNews": 5,
      "justification": ""
  }
  ```
- **Réponses (Erreur) :**
  - `400 Bad Request`: Si l'URL est manquante.
  - `404 Not Found`: Si le post est introuvable ou si l'URL n'est pas un lien Bluesky valide.

### Analyser un Compte

- **Route :** `/vet/account`
- **Méthode :** `POST`
- **Description :** Analyse les posts récents d'un compte Bluesky pour en dégager un profil.
- **Corps de la requête (JSON) :**
  ```json
  {
      "handle": "tjeerd001.bsky.social" 
  }
  ```
  *Note : Le handle peut être fourni au format `tjeerd001.bsky.social`, `@tjeerd001.bsky.social` ou `https://bsky.app/profile/tjeerd001.bsky.social`.*

- **Réponse (Succès - 200 OK) :**
  ```json
  {
      "profil": "tjeerd001.bsky.social",
      "total_posts_analyses": 50,
      "pourcentage_moyen_fake_news": 10.5,
      "emotions_plus_courantes": ["Joie", "Anticipation", "Confiance"],
      "proportion_posts_politiques": 0.1,
      "proportion_posts_factuels": 0.8,
      "resume_sujets": "Ce compte parle principalement de technologie et de développement logiciel..."
  }
  ```
- **Réponses (Erreur) :**
  - `400 Bad Request`: Si le handle est manquant.
  - `404 Not Found`: Si le compte est introuvable ou si le format du handle est invalide.

### Analyser une Tendance

- **Route :** `/vet/trend`
- **Méthode :** `GET`
- **Description :** Analyse les posts d'un flux de tendance (par défaut, le flux "What's Hot").
- **Paramètres de la requête (Query Params) :**
  - `feed_uri` (optionnel) : L'URI AT du flux à analyser. Si non fourni, utilise le flux par défaut.
- **Exemple d'appel :** `http://127.0.0.1:5000/vet/trend`
- **Réponse (Succès - 200 OK) :**
  ```json
  {
      "analyse_brute": "Les tendances actuelles sur le réseau semblent tourner autour de... Les sujets principaux sont A, B et C. Le sentiment général est plutôt positif..."
  }
  ```
