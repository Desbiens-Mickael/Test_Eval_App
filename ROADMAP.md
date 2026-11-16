# Feuille de route EduCraft

Liste des améliorations retenues, par ordre de priorité dans chaque section.
Cocher une case quand la fonctionnalité est fusionnée dans `dev`.

## 🎯 Exercices et contrôles

Comme en classe : le professeur décide ce qui sert à s'exercer (exercice, non noté) et ce qui est évalué (contrôle, noté).

- [ ] **Suivi des exercices par le professeur** : pour chaque élève et chaque exercice (non noté),
      courbe des notes essai après essai, nombre d'essais et correction vue ou non ;
      et, partout dans l'application, « exercices » (non notés) séparés des « contrôles » (notés)
      *(en cours — branche `feat/suivi-entrainements`)*
- [ ] **Contrôles avec période de validité** : dates d'ouverture et de clôture fixées par le professeur.
      À la clôture :
  - les contrôles non rendus sont notés 0 ;
  - les notes et les corrections deviennent visibles pour les élèves (pas avant) ;
  - chaque élève reçoit une notification.

## 🧒 Côté élève

- [ ] **Lien leçon ↔ exercices** : depuis une leçon, accéder directement à ses exercices, et inversement,
      uniquement pour ce que le professeur a attribué au groupe de l'élève
- [ ] **Accessibilité**
  - glisser-déposer des cartes utilisable au clavier et sur écran tactile ;
  - vérifier les contrastes en mode sombre.

## 🛠 Technique et fiabilité

- [ ] **Limiter les tentatives de connexion** (rate limiting), surtout pour les élèves
- [ ] **Volume Docker pour la base de dev** (les données sont perdues à chaque `docker compose down`)
      et **seed plus complet** par défaut (groupe, élèves, leçons attribuées) — voir aussi `npm run seedDemo`
- [ ] **Pagination** des listes : élèves, exercices, résultats
- [ ] **Ménage**
  - retirer `next-app/dist/` du dépôt ;
  - réécrire le README (il parle encore de Django) ;
  - garder une seule des deux librairies `bcrypt` / `bcryptjs` ;
  - corriger la leçon d'histoire du seed (« troisième guerre mondiale »).
- [ ] **Images de leçon** : conversion WebP avec taille maximale, et suppression automatique des images inutilisées
- [ ] **Notifications en temps réel** (SSE ou WebSocket) au lieu du rechargement de la page

## 💡 Pour plus tard

- [ ] **Nouveaux types d'exercices** : associer par paires, remettre dans l'ordre,
      réponse libre corrigée par le professeur, dictée audio
- [ ] **Espace parent** : suivi de la progression de son enfant, en lecture seule
- [ ] **Aide de l'IA pour le professeur** : brouillon d'exercice généré à partir d'une leçon,
      à relire et valider avant publication

## ✅ Déjà fait

- [x] Correction des failles d'autorisation et notation côté serveur (#52)
- [x] Intégration continue GitHub Actions et tests de notation / d'upload (#53)
- [x] Tableau de bord professeur (#54)
- [x] Relecture des copies : note ajustée et commentaire pour l'élève (#55)
- [x] Gestion des comptes élèves : réinitialisation du mot de passe, désactivation (#56)
- [x] Import d'élèves en masse : CSV, Excel ou copier-coller (#57)
- [x] Export des notes en PDF et CSV, par élève et par groupe (#58)
- [x] Progression visible côté élève : réussite par matière, historique et badges (#59)
- [x] Exercices et contrôles : le professeur choisit l'usage de chaque exercice ; exercices non notés,
      essais illimités, note seule après chaque essai, correction qui met fin aux essais (#61)
