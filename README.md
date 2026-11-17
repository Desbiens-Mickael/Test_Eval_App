# EduCraft

Plateforme éducative pour les professeurs et leurs élèves : le professeur rédige des leçons,
crée des exercices et des contrôles, les attribue à ses groupes et suit les résultats ;
l'élève révise ses leçons, s'entraîne et passe ses contrôles.

## Fonctionnalités

**Professeur**
- Leçons avec éditeur riche (images, tableaux), classées par matière et par niveau.
- Exercices de quatre types : choix multiple, vrai ou faux, texte à trous, cartes à classer.
- Deux usages : **exercices** pour s'entraîner (non notés, essais illimités) et **contrôles** notés
  (une tentative, période d'ouverture et de clôture ; à la clôture, les copies non rendues sont notées 0).
- Groupes d'élèves, comptes élèves (création, import CSV / Excel, réinitialisation du mot de passe, désactivation).
- Relecture des copies (note ajustée, commentaire), tableau de bord, export des notes en PDF et CSV.

**Élève**
- Leçons et exercices attribués à son groupe, liens entre une leçon et ses exercices.
- Progression : réussite par matière, historique, badges.

## Architecture

| Dossier | Rôle | Technologies |
|---|---|---|
| `next-app/` | Application web (pages, actions serveur, authentification) | Next.js 14, TypeScript, Prisma, NextAuth v5, TanStack Query, Tailwind / Radix |
| `upload-image-service/` | Envoi et suppression des images (avatars, images de leçon) | Python, FastAPI |
| — | Base de données | PostgreSQL 16 |
| — | Réception des emails en développement | Mailhog |

Les consignes détaillées de chaque partie sont dans `next-app/AGENTS.md` et `upload-image-service/AGENTS.md`.

## Démarrer en local

Prérequis : Docker (avec Compose) et Node.js 20.

1. **Variables d'environnement** : copier les modèles puis les compléter.

   ```bash
   cp next-app/.env.example next-app/.env
   cp upload-image-service/.env.example upload-image-service/.env
   ```

   - `AUTH_SECRET` : générer avec `openssl rand -base64 32`.
   - `UPLOAD_API_KEY` : générer avec `openssl rand -base64 32`, **même valeur** dans les deux fichiers.
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` : facultatifs (connexion avec Google).

2. **Lancer les services** (base, application, upload, Mailhog), depuis la racine :

   ```bash
   npm run dev
   ```

   Cette commande lance `docker compose up --build --watch` : le code de `next-app` est synchronisé
   dans le conteneur à chaque modification.

3. **Créer la base et les données de départ**, dans un autre terminal :

   ```bash
   cd next-app
   npm install
   npm run resetDB
   ```

   `resetDB` applique toutes les migrations sur une base vide puis lance le seed de base.
   Pour un jeu de données plus fourni (3 classes, 18 élèves, une centaine de copies) : `npm run seedDemo`.

### Services

| Service | Adresse |
|---|---|
| Application | http://localhost:3000 |
| Service d'upload | http://localhost:8000 (documentation : `/docs`) |
| Mailhog (emails reçus) | http://localhost:8025 |
| PostgreSQL | `localhost:5432` (utilisateur et mot de passe `postgres`) |

### Comptes de test (seed de base)

| Rôle | Identifiant | Mot de passe |
|---|---|---|
| Professeur | `admin@gmail.com` | `azerty` |
| Élèves | `t.desbiens`, `c.dupont`, `n.garnier`, `l.fontaine` | `azerty22` |

Les élèves de `seedDemo` ont des identifiants du type `demo.lea.martin`, avec le même mot de passe.

### Données

La base est conservée dans le volume Docker `db-data` : elle survit à `docker compose down`.
Pour repartir d'une base vide : `docker compose down -v`, puis `npm run resetDB`.

## Commandes utiles

Dans `next-app/` :

| Commande | Rôle |
|---|---|
| `npm test` | Tests Jest |
| `npx tsc --noEmit` | Vérification des types |
| `npm run lint` | ESLint |
| `npx prisma migrate dev --name <nom>` | Nouvelle migration après modification de `prisma/schema.prisma` |
| `npm run resetDB` | Base recréée de zéro + seed de base |
| `npm run seedDemo` | Données de démonstration (à lancer après `resetDB`) |

Dans `upload-image-service/` :

```bash
pip install -r requirements-dev.txt
python -m pytest -q tests
```

L'intégration continue (`.github/workflows/ci.yml`) lance les types, le lint et les tests de `next-app`,
ainsi que les tests du service d'upload, à chaque pull request.

## Production

`Docker-compose.prod.yml` déploie la base, l'application et le service d'upload derrière Traefik,
à partir des images construites avec `next-app/Dockerfile.prod` et `upload-image-service/Dockerfile.prod`.

- Les migrations sont appliquées au démarrage du conteneur (`prisma migrate deploy`).
- Le seed de production (matières, niveaux, types d'exercices) est compilé pendant la construction
  de l'image ; pour le lancer sur une base neuve : `npm run seedDB` dans le conteneur.

## Feuille de route

Les évolutions prévues et réalisées sont suivies dans [ROADMAP.md](ROADMAP.md).
