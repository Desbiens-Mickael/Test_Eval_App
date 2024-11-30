/*
  Warnings:

  - You are about to drop the column `type` on the `Exercice` table. All the data in the column will be lost.
  - You are about to drop the `ContentExerciceCard` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `answer` to the `Exercice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Exercice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeID` to the `Exercice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContentExerciceCard" DROP CONSTRAINT "ContentExerciceCard_exerciceID_fkey";

-- AlterTable
ALTER TABLE "Exercice" DROP COLUMN "type",
ADD COLUMN     "answer" JSONB NOT NULL,
ADD COLUMN     "content" JSONB NOT NULL,
ADD COLUMN     "typeID" TEXT NOT NULL;

-- DropTable
DROP TABLE "ContentExerciceCard";

-- DropEnum
DROP TYPE "ExerciceType";

-- CreateTable
CREATE TABLE "ExerciceType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciceType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciceType_name_key" ON "ExerciceType"("name");

-- AddForeignKey
ALTER TABLE "Exercice" ADD CONSTRAINT "Exercice_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "ExerciceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
