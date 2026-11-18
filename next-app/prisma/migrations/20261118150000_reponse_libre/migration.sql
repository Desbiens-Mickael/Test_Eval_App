-- Réponse libre corrigée par le professeur

-- Copie en attente de correction et notes par question
ALTER TABLE "StudentExercice" ADD COLUMN "pendingReview" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "StudentExercice" ADD COLUMN "questionReviews" JSONB;

-- Copies à corriger d'un professeur
CREATE INDEX "StudentExercice_pendingReview_idx" ON "StudentExercice"("pendingReview");

-- Nouveau type (ajouté ici pour que les bases déjà en service le proposent)
INSERT INTO "ExerciceType" ("id", "name", "createdAt", "updatedAt") VALUES
  ('exercice_type_reponse_libre', 'Réponse libre', NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;
