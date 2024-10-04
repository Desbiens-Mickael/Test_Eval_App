/*
  Warnings:

  - You are about to drop the column `name` on the `LessonSubject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[label]` on the table `LessonSubject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label,color]` on the table `LessonSubject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `LessonSubject` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExerciceType" AS ENUM ('Card', 'True_or_False', 'List', 'Fill_blank');

-- DropIndex
DROP INDEX "LessonSubject_name_color_key";

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "LessonSubject" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ExerciceLevel" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciceLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "levelID" TEXT NOT NULL,
    "type" "ExerciceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "lessonID" TEXT NOT NULL,

    CONSTRAINT "Exercice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentExerciceCard" (
    "id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "correctAnswer" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exerciceID" TEXT NOT NULL,

    CONSTRAINT "ContentExerciceCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciceLevel_label_key" ON "ExerciceLevel"("label");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciceLevel_label_color_key" ON "ExerciceLevel"("label", "color");

-- CreateIndex
CREATE UNIQUE INDEX "ContentExerciceCard_exerciceID_key" ON "ContentExerciceCard"("exerciceID");

-- CreateIndex
CREATE UNIQUE INDEX "LessonSubject_label_key" ON "LessonSubject"("label");

-- CreateIndex
CREATE UNIQUE INDEX "LessonSubject_label_color_key" ON "LessonSubject"("label", "color");

-- AddForeignKey
ALTER TABLE "Exercice" ADD CONSTRAINT "Exercice_levelID_fkey" FOREIGN KEY ("levelID") REFERENCES "ExerciceLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercice" ADD CONSTRAINT "Exercice_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercice" ADD CONSTRAINT "Exercice_lessonID_fkey" FOREIGN KEY ("lessonID") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentExerciceCard" ADD CONSTRAINT "ContentExerciceCard_exerciceID_fkey" FOREIGN KEY ("exerciceID") REFERENCES "Exercice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
