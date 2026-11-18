-- Nouveaux types d'exercices corrigés automatiquement.
-- Ajoutés ici (et pas seulement dans les seeds) pour que les bases déjà en
-- service les proposent aussi au professeur.

INSERT INTO "ExerciceType" ("id", "name", "createdAt", "updatedAt") VALUES
  ('exercice_type_paires', 'Associer par paires', NOW(), NOW()),
  ('exercice_type_ordre', 'Remettre dans l''ordre', NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;
