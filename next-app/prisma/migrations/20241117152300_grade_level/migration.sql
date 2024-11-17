/*
  Warnings:

  - Added the required column `GradeLevelsID` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "GradeLevelsID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GradeLevels" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeLevels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevels_label_key" ON "GradeLevels"("label");

-- CreateIndex
CREATE UNIQUE INDEX "GradeLevels_label_color_key" ON "GradeLevels"("label", "color");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_GradeLevelsID_fkey" FOREIGN KEY ("GradeLevelsID") REFERENCES "GradeLevels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
