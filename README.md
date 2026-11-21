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

### Faire tester en local avec de vrais e-mails

Par défaut, en développement, tous les e-mails partent dans Mailhog. Pour que des testeurs
les reçoivent dans leur vraie boîte, renseigner un vrai serveur SMTP dans `next-app/.env`.
Le plus simple est un compte Gmail (environ 500 e-mails par jour) :

1. Activer la validation en deux étapes sur le compte Google.
2. Créer un mot de passe d'application sur https://myaccount.google.com/apppasswords
   (nom : « EduCraft »). Google affiche un code de 16 lettres, à copier sans les espaces.
3. Dans `next-app/.env` :

   ```env
   SMTP_HOST="smtp.gmail.com"     # « mailhog » ou vide = retour à Mailhog
   SMTP_PORT="465"
   SMTP_USER="votre.adresse@gmail.com"
   SMTP_PASS="codeapplication16l" # le mot de passe d'application, pas celui du compte
   MAILER_FROM_ADDRESS="votre.adresse@gmail.com"  # même adresse que SMTP_USER
   ```

Tout autre serveur SMTP fonctionne de la même façon (port 465 en TLS ou 587 en STARTTLS).
Le mot de passe d'application peut être révoqué à tout moment depuis la même page Google.

Les liens des e-mails (confirmation, mot de passe, accès parent…) pointent vers `NEXT_BASE_URL`.
Si les testeurs utilisent leur propre appareil sur le même réseau, remplacer `localhost`
par l'adresse IP de l'ordinateur (`ipconfig` sous Windows, ligne « Adresse IPv4 ») dans
`NEXT_BASE_URL` et `AUTH_URL`, par exemple `http://192.168.1.20:3000`, et autoriser le port 3000
dans le pare-feu.

Après modification du `.env`, relancer l'application, puis vérifier avec un e-mail d'essai :

```bash
cd next-app
npm run mail:test -- votre.adresse@exemple.com
```

Au démarrage, le journal de l'application indique `[mail] Envoi réel via …` ou
`[mail] Envoi vers MailHog`.

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
| `npm run mail:test -- <adresse>` | E-mail d'essai avec la configuration SMTP du `.env` |

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
