# AGENTS — Next.js App

## Mission du service
- Application Next.js 14 pour EduCraft : marketing public, espace professeur (ADMIN) et espace élève (STUDENT).
- Gère l'authentification (credentials + Google OAuth), la gestion de contenu pédagogique (leçons, exercices), la gestion des groupes/élèves, les notifications et l'interface d'administration.
- Fonctionne en binôme avec la base PostgreSQL (Prisma) et le service FastAPI d’upload d’images.

## Orchestration des agents métier
- **Agent Authentification & Session**  
  - `auth.ts`, `auth.config.ts`, `src/middleware.ts`, `src/actions/login*.ts`, `src/actions/logout.action.ts`.  
  - NextAuth v5 (JWT) avec stratégie credentials (admins & élèves) + Google OAuth.  
  - Gère vérification email, double facteur, tokens de validation/réinitialisation via `src/data/*token*.ts` et mails (`src/lib/mail.ts`).  
  - Middleware redirige selon rôle : `/admin/**`, `/eleve/**`, `/profil/**`.
- **Agent Gestion des enseignants & élèves**  
  - `src/data/user-data.ts`, `src/data/student-data.ts`, actions associées (`src/actions/student*.ts`, `src/actions/user-info.action.ts`, etc).  
  - CRUD des élèves par professeur, attribution à des groupes, activation de compte, mise à jour profil/avatar.  
  - Utilise `react-hook-form` + schémas Zod dans `src/shema-zod/*` pour valider les formulaires.
- **Agent Contenu pédagogique**  
  - Leçons (`src/data/lesson`, `src/app/(protected)/admin/lecons/**`), exercices (`src/data/exercice*`, `src/app/(protected)/admin/exercices/**`).  
  - Editeur riche basé sur Tiptap (`src/components/block-editor/**`) avec upload d'images vers le service FastAPI.  
  - Gestion des sujets (`LessonSubject`), niveaux (`GradeLevels`, `ExerciceLevel`), types (`ExerciceType`) via actions dédiées.
- **Agent Notifications & Suivi**  
  - `src/data/notification/notification.data.ts`, `src/actions/notification.action.ts`.  
  - Dispatche notifications à destination des professeurs et/ou élèves (`Notification`, `TeacherNotification`, `StudentNotification` dans `prisma/schema.prisma`).  
  - Utilisé pour informer d’une nouvelle leçon, exercice ou résultat (`NotificationType`).
- **Agent Expérience Utilisateur & Etat**  
  - UI réactive avec design system Radix + Tailwind (`components.json`, `tailwind.config.ts`).  
  - `@tanstack/react-query` & `zustand` pour cache client et état local (`src/hooks/**`).  
  - Animations (Framer Motion), sections marketing (`src/components/sections/**`), header public/protégé, sidebar (`src/components/sidebar/**`).  
  - Gère upload avatar côté client (`src/hooks/mutations/use-update-user-avatar.ts`) en coordination avec le service FastAPI.

## Architecture & flux techniques
- **Stack** : Next.js 14 App Router, TypeScript, React Query, Prisma, NextAuth, Tailwind, Jest.
- **Structure du dossier `src/`** (à respecter strictement) :
  - `_mocks_` : mocks de tests (miroir de la structure réelle).
  - `_test_` : tests Jest/RTL, calqués sur l’arborescence des composants/pages ciblés.
  - `actions`, `animations`, `app`, `components`, `config`, `data`, `hooks`, `lib`, `schema-zod`, `style`, `type` comme décrit dans les règles d’équipe.
- **Actions serveur** : dossier `src/actions/` centralise les mutations sécurisées ; toutes préfixées par `"use server"` et contrôlent `currentUser` (`src/lib/auth.ts`).
- **Accès données** : dossier `src/data/` encapsule Prisma et hashage (`src/lib/hash-password.ts` via bcrypt).  
- **Seed & scripts** : `src/data/dev-data/seed.ts`, `src/data/prod-data/seed.ts` + scripts `npm run resetDB`, `npm run build:seed`, `npm run seedDB`.
- **Protection des routes** : middleware NextAuth + layout `(protected)` avec `SidebarProvider`, `AppSidebar`, `Header` personnalisés.
- **Tests** : Jest + Testing Library (`jest.config.ts`, `_test_/`). Couverture cible > 80 %, lancer via `npm run test[:watch|:coverage]`.

## Intégrations externes
- **Base PostgreSQL** : via Prisma. Valider `DATABASE_URL` (compose : `postgresql://postgres:postgres@db:5432/postgres?schema=public`).
- **Service d’upload** (`upload-image-service`) :  
  - Côté client : `NEXT_PUBLIC_CLIENT_DOMAIN_API` pour fetch depuis le navigateur.  
  - Côté serveur (Next Image) : `NEXT_PUBLIC_SERVER_DOMAIN_API` pour générer URLs accessibles depuis le rendu serveur.  
  - Config images (`next.config.mjs`) autorise domaines `upload-service`, `localhost:8000`, ainsi que valeurs prod.
- **Emailing** : `src/lib/mail.ts` (Nodemailer). En dev utilise Mailhog (`mailhog:1025`), en prod SMTP sécurisé.
- **OAuth Google** : `auth.config.ts` déclare le provider avec `prompt=consent`, `access_type=offline`.

## Variables d’environnement (fichier `.env`)
| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL (format Prisma) |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Clé NextAuth pour signer les JWT |
| `AUTH_GOOGLE_ID` / `GOOGLE_CLIENT_ID` | Client OAuth Google (selon version NextAuth) |
| `AUTH_GOOGLE_SECRET` / `GOOGLE_CLIENT_SECRET` | Secret OAuth Google |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Paramètres SMTP production |
| `MAILER_FROM_ADDRESS`, `MAILER_TO_ADDRESS` | Adresse expéditrice / réception test |
| `NEXT_BASE_URL` | URL publique du front utilisée dans les emails |
| `NEXT_PUBLIC_CLIENT_DOMAIN_API` | URL HTTP atteignable par le navigateur pour l’upload (`http://localhost:8000` en dev) |
| `NEXT_PUBLIC_SERVER_DOMAIN_API` | URL atteignable côté serveur/Next Image (souvent host Docker) |

> En local Docker (`docker-compose.yml`), les `.env` sont montés pour chaque service ; penser à garder les URLs cohérentes entre client/serveur pour l’upload.

## Règles internes à respecter
- **Composants** : privilégier Server Components ; n’utiliser `"use client"` que pour l’état côté client (forms, drag & drop, etc.).  
  - `components/ui/**` : primitives UI (shadcn + Radix).  
  - `components/[feature]/**` : composants partagés par fonctionnalité.  
  - `app/[route]/(components)/**` : composants propres à une route (ex. `src/app/(protected)/eleve/exercices/(components)/`).  
  - Pattern clean architecture : isoler logique, validation et accès données.
- **État & données** : TanStack Query pour la lecture serveur, Server Actions pour les mutations, Zustand pour l’état global partagé. Couples form-data validés avec Zod (`schema-zod` + `@hookform/resolvers/zod`).
- **Formulaires** : `react-hook-form` obligatoire, schémas dans `schema-zod`, validations testées dans `_test_`.
- **UI/UX** : Tailwind + Radix UI pour l’accessibilité, variants via class-variance-authority, mode sombre avec `next-themes`, notifications via Sonner, `next/image` + Sharp pour l’optimisation.
- **Sécurité** : NextAuth + Prisma Adapter, mots de passe hashés avec bcrypt, toutes les entrées validées Zod côté client et serveur.
- **Performance** : `loading.tsx`, streaming, pagination des listes, `React.lazy` pour les blocs lourds et import dynamique côté client.
- **Tests** : Jest + React Testing Library ; viser >80% couverture, couvrir logique critique, formulaires et schémas Zod. Les mocks résident dans `_mocks_`.
- **TypeScript** : strict, pas de `any`. Déclarer interfaces/types globaux dans `src/type`, recourir aux génériques lorsque pertinent.
- **Git & documentation** : commits conventionnels (`type(scope): message`), PR pour les gros ajouts, documenter composants complexes, tenir README & `AGENTS.md` à jour, commenter seulement la logique délicate.

## Exploitation & commandes
- `npm install` puis `npm run dev` (port 3000) en local.  
- `npm run build` + `npm run start` pour production.  
- `npx prisma migrate dev` / `npm run resetDB` pour synchroniser le schéma.  
- Docker : `docker compose up --build` lance PostgreSQL, Next.js, upload-service, Mailhog.

## Points de vigilance & axes d’amélioration
- Cohérence des rôles (`UserRole`) : seul ADMIN accède aux écrans `/admin/**`. STUDENT renvoyé vers `/eleve/dashboard`.  
- Les actions serveur retournent souvent `{ error | success }` en texte libre : harmoniser pour internationalisation future.  
- Upload d’images : suppression du fichier existant côté service via `DELETE /avatar/{img}`. Gérer retours 404 du service pour éviter état cassé.  
- Vérifier que `origin` CORS de l’upload autorise bien toutes URLs nécessaires (valeur unique attendue).  
- Pense-bête déploiement : `next.config.mjs` met `output: "standalone"` uniquement en prod.

## Backlog suggéré
- Ajouter tests d’intégration pour les actions critiques (auth, création d’élève).  
- Centraliser la configuration des URLs d’API (éviter `process.env` direct dans les hooks).  
- Prévoir upload d’images dans leçons (actuellement redimensionnement commenté).  
- Documenter les seeds (quelles données exemple créées) et fournir scripts d’import/export.
