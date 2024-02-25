# ✨ Next.js 14.1.0 avec Docker ✨

Ce template sert de base pour les projets utilisant Next.js dans un environnement de développement Dockerisé, facilitant l'installation, le développement d'applications Next.js.

## Prérequis

Avant de commencer, assurez-vous que les outils suivants sont installés sur votre système :

- Node.js (version 18 ou supérieure)

Pour les utilisateurs de Docker Desktop :

- Docker Desktop (version 4.24 ou supérieure)

Pour les utilisateurs n'utilisant pas Docker Desktop :

- Docker (assurez-vous d'avoir une version récente, compatible avec Docker Compose version 2.22.0 ou supérieure)
- Docker Compose (version 2.22.0 ou supérieure)

Cela garantira le bon fonctionnement des commandes décrites dans ce guide.

## Installation

### Installation des dépendances

Exécutez la commande suivante pour installer les dépendances du projet :

```bash
npm install
```

Cette commande téléchargera et installera les bibliothèques et les outils requis par votre application Next.js.

### Configuration de PostgreSQL avec Docker

Ce template inclut la configuration nécessaire pour utiliser PostgreSQL comme base de données pour votre application Next.js. Suivez ces étapes pour configurer et démarrer votre base de données PostgreSQL avec Docker :

1. **Docker Compose** : Le fichier `docker-compose.yml` inclus dans ce projet définit le service PostgreSQL. Voici un exemple de configuration pour le service de base de données, libre à vous de changer les identifiants selon votre convenance:

```yaml
db:
  image: postgres:16-alpine
  restart: always
  environment:
    POSTGRES_PASSWORD: postgres
    PGUSER: postgres
  ports:
    - 5432:5432
  healthcheck:
    test: ["CMD-SHELL", "pg_isready"]
    interval: 10s
    timeout: 5s
    retries: 5
```

### Création de l'image Docker et démarrage des conteneurs

Pour construire l'image Docker de votre application et démarrer les conteneurs, utilisez :

```bash
npm run dev
```

### Mise en route du hot reloading et synchronisation des fichiers

La commande watch permet de lancer un processus de surveillance des modifications de fichiers dans votre projet Next.js, assurant le hot reloading et la synchronisation avec les conteneurs Docker.
Pour cela, lancez la commande suivante dans un second terminal :

```bash
npm run watch
```

Note : Assurez-vous que votre version de Docker Compose est à jour pour utiliser la commande watch.

### Conclusion

Vous êtes maintenant prêt à développer votre application Next.js dans un environnement Dockerisé. Cette configuration facilite le développement collaboratif et assure que votre application fonctionne de manière uniforme dans tous les environnements.

## Authors

- [@Desbiens_Mickaël](https://github.com/Desbiens-Mickael)
