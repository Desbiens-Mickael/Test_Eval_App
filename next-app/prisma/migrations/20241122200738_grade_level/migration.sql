/*
  Warnings:

  - You are about to drop the column `name` on the `Lesson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,authorId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,authorId]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `GradeLevelsID` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `content` on the `Lesson` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Lesson_name_authorId_key";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "name",
ADD COLUMN     "GradeLevelsID" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;

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

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_title_authorId_key" ON "Lesson"("title", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_authorId_key" ON "Lesson"("slug", "authorId");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_GradeLevelsID_fkey" FOREIGN KEY ("GradeLevelsID") REFERENCES "GradeLevels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
