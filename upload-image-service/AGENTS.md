# AGENTS — Upload Image Service

## Mission du service
- Micro-service FastAPI chargé de stocker et servir les images (avatars utilisateur & visuels de leçons) pour l’application EduCraft.
- Offre des endpoints REST pour ajouter, récupérer et supprimer des fichiers, avec traitement de base (renommage sécurisé, conversion WebP, redimensionnement optionnel).
- Exposé sur le port 8000 ; monté par Docker compose (`service upload-service`) avec volume persistant `./uploads/images`.

## Agents fonctionnels
- **Agent Avatar**  
  - Routes : `GET /avatar/{image_path}`, `POST /avatar`, `DELETE /avatar/{image_path}` dans `main.py`.  
  - Redimensionne l’image en 150x150 et convertit en WebP avant sauvegarde.  
  - Retourne `image_path` (nom de fichier) utilisé par le front pour construire l’URL côté client et serveur.
- **Agent Leçon**  
  - Routes : `GET /lesson/{image_path}`, `POST /lesson`, `DELETE /lesson/{image_path}`.  
  - Laisse la taille d’origine (hooks de redimensionnement/commentaire disponibles).  
  - Identique à l’agent avatar pour la validation MIME et la réponse JSON.
- **Agent Traitement & Sécurité des fichiers**  
  - Implémenté dans `upload_file/UploadImage.py`.  
  - Vérifie les types MIME (`image/jpeg`, `png`, `gif`, `bmp`, `tiff`, `webp`).  
  - Génére un nom aléatoire (`uuid4`), sauvegarde dans un fichier temporaire `.webp`, puis persiste sous le répertoire désiré (`./uploads/images/{avatars|lessons}/`).  
  - Fournit des helpers pour convertir aux formats PNG/WEBP/JPEG/… et pour redimensionner ; veille à supprimer le fichier temporaire (`cleanup()`).

## Architecture & dépendances
- **Framework** : FastAPI + Starlette, `uvicorn` pour le serveur ASGI.
- **Bibliothèques** : Pillow (manipulation d’images), python-multipart (upload), python-dotenv (chargement `.env`), python-magic (détection MIME si besoin futur).
- **Configuration Docker** :  
  - `Dockerfile` basé sur `python:3.10-slim`, installe les dépendances système nécessaires à Pillow (`libjpeg`, `zlib`, etc).  
  - Commande de lancement : `uvicorn main:app --reload --host 0.0.0.0 --port 8000`.
- **Stockage** : fichiers sur disque (`/app/uploads/images/**`). Volume monté dans `docker-compose.yml` pour la persistance.

## Flux externes & intégration
- **Front/Next.js** :  
  - En upload : fetch depuis le navigateur via `NEXT_PUBLIC_CLIENT_DOMAIN_API` (`http://localhost:8000` en dev) avec `FormData`.  
  - Côté serveur : Next Image consomme `NEXT_PUBLIC_SERVER_DOMAIN_API` (ex. `http://upload-service:8000`).  
  - Après POST, le front supprime éventuellement l’ancienne image via `DELETE` (cf. `src/hooks/mutations/*avatar*.ts`).
- **CORS** : `CORS_URL` issu du `.env` et injecté dans `allow_origins`. Prévoir une valeur de type JSON (ex. `["http://localhost:3000"]`) ou adapter le code pour splitter les URLs (sinon FastAPI traitera la chaîne comme itérable de caractères).

## Variables d’environnement (`.env`)
| Variable | Description |
| --- | --- |
| `CORS_URL` | Liste (ou chaîne séparée par virgules) des origines autorisées à appeler l’API |
| `UPLOAD_DIR` *(optionnel)* | À prévoir si l’on souhaite paramétrer la racine d’upload (actuellement chemin codé en dur) |

> Remarque : le compose de dev surveille `./upload-image-service/requirement.txt` (typo). Corriger vers `requirements.txt` pour bénéficier du rebuild automatique.

## Exploitation & commandes
- Installation locale : `pip install -r requirements.txt`.  
- Lancement : `uvicorn main:app --host 0.0.0.0 --port 8000`.  
- Docker : inclus dans `docker compose up --build` (port mappé 8000).  
- Dossiers à surveiller : `uploads/images/avatars`, `uploads/images/lessons` (montés en volume). Nettoyer manuellement si besoin.

## Règles internes à respecter
- **Organisation** :  
  - `upload_file/` contient la logique métier (classes utilitaires).  
  - `main.py` expose des routes épurées qui délèguent au module.  
  - Respecter le principe de responsabilité unique ; factoriser les traitements communs (validation, conversion) dans des helpers/classes.
- **FastAPI** : tirer parti de Pydantic (modèles de réponse, validation), documenter chaque endpoint (descriptions, codes retour) pour Swagger, structurer les routes par ressource (`/avatar`, `/lesson`), injection de dépendances pour config/logging.
- **Gestion des fichiers** : valider type MIME via python-magic, limiter la taille à 5 MB, générer des noms sûrs, nettoyer les métadonnées, utiliser Pillow pour resize/optimisation et streaming si fichiers volumineux.
- **Sécurité** : vérifier systématiquement le contenu (`content_type`, signature), prévoir rate limiting, authentifier via JWT + dépendances FastAPI, assainir les noms de fichiers avant écriture.
- **Performance** : compresser/optimiser avant stockage, envisager cache de réponses statiques, gérer correctement les ressources (fermeture fichiers/temp), supporter upload en streaming.
- **Gestion des erreurs & logging** : centraliser les handlers (`HTTPException`, erreurs générales), retourner des messages explicites, logger en JSON avec niveaux différenciés et identifiants de requête.
- **Tests** : utiliser `pytest` + `httpx`/`TestClient`, couvrir logique utilitaire (`UploadImage`), scénarios limites (type invalide, dépassement taille, suppression inexistante), viser >80 % de couverture.
- **Configuration** : variables d’env centralisées (ex. limit upload size, dossiers cible), fournir `.env.example`, valider la configuration au démarrage avec Pydantic/BaseSettings.
- **Docker** : privilégier images multi-stage optimisées, documenter les variables nécessaires, suivre bonnes pratiques de sécurité (droits limités, nettoyage caches).
- **Documentation** : maintenir l’API à jour (Swagger/Redoc), documenter fonctions complexes et erreurs (codes HTTP, payload attendu), proposer exemples d’appel (curl, fetch).

## Points de vigilance & améliorations
- Les exceptions d’`UploadImage.__file_type_check` lèvent une `ValueError` et sont renvoyées comme 500 ; transformer en `HTTPException(status_code=415, …)` pour un retour explicite.  
- Gérer les erreurs `os.remove` (ignore si fichier absent) pour éviter que la suppression d’un avatar inexistant ne fasse échouer l’appel global.  
- Ajouter des tests automatisés (pytest + HTTPX) couvrant upload, suppression, et contrôle MIME.  
- Envisager la configuration dynamique des dossiers de destination et du quality/resize par route (actuellement codé en dur).
