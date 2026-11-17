-- Tri alphabétique français pour les noms et titres affichés en liste.
-- La collation par défaut de l'image Postgres Alpine compare octet par octet :
-- « Léa » était triée après « Lucas » et « Élodie » après « Zoé ».
-- fr-FR-x-icu (ICU, fournie par l'image officielle) ordonne comme un dictionnaire.
-- Les identifiants de connexion ne sont pas concernés.

ALTER TABLE "Student" ALTER COLUMN "name" TYPE TEXT COLLATE "fr-FR-x-icu";
ALTER TABLE "Group" ALTER COLUMN "name" TYPE VARCHAR(20) COLLATE "fr-FR-x-icu";
ALTER TABLE "Lesson" ALTER COLUMN "title" TYPE TEXT COLLATE "fr-FR-x-icu";
ALTER TABLE "Exercice" ALTER COLUMN "title" TYPE TEXT COLLATE "fr-FR-x-icu";
ALTER TABLE "LessonSubject" ALTER COLUMN "label" TYPE TEXT COLLATE "fr-FR-x-icu";
ALTER TABLE "ExerciceLevel" ALTER COLUMN "label" TYPE TEXT COLLATE "fr-FR-x-icu";
ALTER TABLE "GradeLevels" ALTER COLUMN "label" TYPE TEXT COLLATE "fr-FR-x-icu";
