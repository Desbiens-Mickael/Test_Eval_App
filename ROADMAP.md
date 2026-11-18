# Feuille de route EduCraft

Liste des améliorations retenues, par ordre de priorité dans chaque section.
Cocher une case quand la fonctionnalité est fusionnée dans `dev`.

## 🎯 Exercices et contrôles

Comme en classe : le professeur décide ce qui sert à s'exercer (exercice, non noté) et ce qui est évalué (contrôle, noté).

Rien en attente : voir « Déjà fait ».

## 🧒 Côté élève

Rien en attente : voir « Déjà fait ».

## 🛠 Technique et fiabilité

Rien en attente : voir « Déjà fait ».

## 💡 Pour plus tard

- [ ] **Nouveaux types d'exercices**, en trois étapes :
  - [ ] Associer par paires et remettre dans l'ordre (corrigés automatiquement)
        *(en cours — branche `feat/types-exercices`)*
  - [ ] Réponse libre corrigée par le professeur
  - [ ] Dictée audio (fichier enregistré par le professeur)
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
- [x] Suivi des exercices par le professeur (courbe des notes, essais, correction vue) ;
      « exercices » et « contrôles » séparés partout dans l'application (#62)
- [x] Contrôles avec période de validité : dates d'ouverture et de clôture ; à la clôture, copies non rendues
      notées 0, notes et corrections visibles pour les élèves, qui sont notifiés (#63)
- [x] Lien leçon ↔ exercices côté élève, limité à ce qui est attribué à son groupe (#64)
- [x] Accessibilité : cartes déplaçables au clavier et au tactile (bouton « Déplacer »),
      contrastes du mode sombre conformes WCAG AA (#65)
- [x] Limite des tentatives de connexion : par compte et par adresse IP (#66)
- [x] Volume Docker pour la base de dev et seed de base plus complet (#67)
- [x] Pagination côté serveur des élèves, exercices et copies (#68)
- [x] Tri alphabétique français des noms et titres (collation ICU) (#69)
- [x] Ménage : `dist/` retiré du dépôt, `bcryptjs` seul, README réécrit (#70)
- [x] Images de leçon en WebP (1600 px max) et suppression automatique des images inutilisées (#71)
- [x] Notifications en temps réel (SSE) au lieu du rechargement de la page (#72)
