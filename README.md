# ✨ Next.js 14.1.0 avec Docker 🐳

Ce template sert de base solide pour les projets utilisant Next.js dans un environnement de développement Dockerisé 🚀. Il facilite l'installation et le développement d'applications Next.js, tout en incluant différents services, tels que :

- 📦 Une base de données PostgreSQL
- 🌅 Un microservice Python pour l'upload d'images

## Table des Matières 📚

- [Prérequis](#prérequis)
- [Installation](#installation)
  - [Dépendances Next.js](#installation-des-dépendances)
  - [Configuration PostgreSQL](#configuration-de-postgresql-avec-docker)
  - [Migration Prisma](#lancer-la-migration-avec-prisma)
  - [Docker et Conteneurs](#création-de-limage-docker-et-démarrage-des-conteneurs)
- [Développement Local Python](#développement-local-du-microservice-python)
- [Contribuer](#soumission-de-contributions)
- [Conclusion](#conclusion)
- [Auteurs](#authors)

## Prérequis 📋

Avant de commencer, assurez-vous que les outils suivants sont installés sur votre système :

- **Node.js (version 18 ou supérieure)** : Nécessaire pour exécuter l'environnement de développement Next.js et gérer les dépendances du projet.

**Pour les utilisateurs de Docker Desktop :**

- **Docker Desktop (version 4.24 ou supérieure)** : Fournit une interface utilisateur pour gérer les conteneurs Docker et les configurations Docker Compose.

**Pour les utilisateurs n'utilisant pas Docker Desktop :**

- **Docker** : Essentiel pour créer et gérer les conteneurs. Assurez-vous d'avoir une version récente.
- **Docker Compose (version 2.22.0 ou supérieure)** : Utilisé pour définir et exécuter des applications multi-conteneurs.

Cela garantira le bon fonctionnement des commandes décrites dans ce guide.

## Installation 💾

### Installation des dépendances

Exécutez la commande suivante pour installer les dépendances du service Next.js:

```bash
cd next-app && npm install
```

Cette commande téléchargera et installera les bibliothèques et les outils requis par votre application Next.js.

### Configuration de PostgreSQL avec Docker 🐘

Ce template inclut la configuration nécessaire pour utiliser PostgreSQL comme base de données pour votre application Next.js. Suivez ces étapes pour configurer et démarrer votre base de données PostgreSQL avec Docker :

1. **Docker Compose** : Le fichier `docker-compose.yml` inclus dans ce projet définit le service PostgreSQL. Voici un exemple de configuration pour le service de base de données, libre à vous de changer les identifiants selon votre convenance:

```yaml
db:
  image: postgres:16-alpine
  restart: always
  environment:
    POSTGRES_PASSWORD: mot_de_passe
    PGUSER: nom_utilisateur
  ports:
    - 5432:5432
  healthcheck:
    test: ["CMD-SHELL", "pg_isready"]
    interval: 10s
    timeout: 5s
    retries: 5
```

### Lancer la Migration avec Prisma 🔄

Ce projet utilise [Prisma](https://www.prisma.io/docs/) pour la gestion de la base de données, offrant une approche moderne à l'interaction avec la base de données via un ORM. Vous êtes libre d'utiliser l'ORM de votre choix, mais si vous optez pour Prisma, suivez les étapes ci-dessous pour synchroniser votre schéma avec la base de données.

Après avoir créé votre schéma, lancez la commande suivante pour le synchroniser avec la base de données :

```bash
npx prisma migrate dev --name init
```

Cela créera un fichier de migration dans le répertoire `./prisma/migrations`. Pour toute question ou besoin d'aide supplémentaire sur Prisma, veuillez consulter la [documentation officielle de Prisma](https://www.prisma.io/docs/).

Pour les interactions avec la base de données, une instance Singleton de Prisma est mise à disposition dans le répertoire `./src/utils/db.ts`. Cette approche garantit que l'instance de Prisma est unique et réutilisable à travers toute l'application, optimisant ainsi les performances et l'accès à la base de données.

### Création des Fichiers de Variables d'Environnement 🔑

Pour configurer votre environnement de manière personnalisée, veuillez créer un fichier `.env` dans le répertoire de chaque service, en vous basant sur le contenu des fichiers `.env.example` fournis. Assurez-vous de remplacer les valeurs exemples par vos propres valeurs selon les besoins de votre configuration.

### Création de l'Image Docker et Démarrage des Conteneurs 📦

Pour construire les images Docker de votre application et démarrer les conteneurs, positionnez vous à la racine du projet et utilisez :

```bash
npm run dev
```

### Mise en route du hot reloading et synchronisation des fichiers 🔥

La commande watch permet de lancer un processus de surveillance des modifications de fichiers dans les différents containers, assurant le hot reloading et la synchronisation avec les conteneurs Docker.
Pour cela, lancez la commande suivante dans un second terminal :

```bash
npm run watch
```

Note : Assurez-vous que votre version de Docker Compose est à jour pour utiliser la commande watch.

## Développement Local du Microservice Python 🐍

Pour contribuer au développement du microservice Python avec de nouvelles fonctionnalités ou corrections, il est recommandé de configurer un environnement de développement local. Cela implique la création d'un environnement virtuel Python et l'installation des dépendances nécessaires.

### Création et Activation d'un Environnement Virtuel 🤖

- Python (version 3.8 ou supérieure)

1. **Ouvrez un Terminal** : Naviguez jusqu'au dossier contenant le microservice Python.

2. **Créez un Environnement Virtuel** : Exécutez la commande suivante pour créer un environnement virtuel. Remplacez `venv` par le nom que vous souhaitez donner à votre environnement virtuel :

   ```bash
   # Pour Unix/Linux/macOS
   python3 -m venv venv

   # Pour Windows
   py -m venv venv
   ```

3. **Activez l'Environnement Virtuel** :

   ```bash
   # Pour Unix/Linux/macOS
   source venv/bin/activate

   # Pour Windows
   .\venv\Scripts\activate
   ```

### Installation des Dépendances

Avec l'environnement virtuel activé, installez les dépendances du microservice en exécutant :

```bash
pip install -r requirements.txt
```

Cela installera toutes les dépendances nécessaires, comme spécifié dans le fichier `requirements.txt`, dans votre environnement virtuel.

### Développement et Test

Vous pouvez maintenant commencer à développer et tester de nouvelles fonctionnalités ou corrections. Assurez-vous de tester vos modifications localement avant de soumettre vos contributions.

### Désactivation de l'Environnement Virtuel

Lorsque vous avez terminé votre session de développement, désactivez l'environnement virtuel en exécutant :

```bash
deactivate
```

Cela remettra votre terminal à l'état normal, en dehors de l'environnement virtuel.

### Soumission de Contributions 🤝

Après avoir testé vos modifications et vous être assuré qu'elles répondent aux standards du projet, vous pouvez soumettre un pull request avec vos changements.

### Conclusion 🎉

Vous êtes maintenant prêt à développer votre application Next.js dans un environnement Dockerisé. Cette configuration facilite le développement collaboratif et assure que votre application fonctionne de manière uniforme dans tous les environnements.

## Authors ✍️

- [@Desbiens_Mickaël](https://github.com/Desbiens-Mickael)
