/*
  Warnings:

  - You are about to alter the column `name` on the `Group` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.

*/
-- DropIndex
DROP INDEX "Group_authorId_key";

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "name" SET DATA TYPE VARCHAR(20);
