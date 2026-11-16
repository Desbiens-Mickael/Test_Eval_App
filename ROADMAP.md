# Feuille de route EduCraft

Liste des améliorations retenues, par ordre de priorité dans chaque section.
Cocher une case quand la fonctionnalité est fusionnée dans `dev`.

## 🧒 Côté élève

- [ ] **Progression visible** : pourcentage de réussite par matière, historique et badges
      *(en cours — branche `feat/progression-eleve`)*
- [ ] **Mode entraînement** : exercices non notés, rejouables à volonté, à côté des exercices notés
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
