-- Nouveau type d'exercice : dictée audio, corrigée mot à mot.
-- Ajouté ici pour que les bases déjà en service le proposent aussi.
INSERT INTO "ExerciceType" ("id", "name", "createdAt", "updatedAt") VALUES
  ('exercice_type_dictee', 'Dictée', NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;
