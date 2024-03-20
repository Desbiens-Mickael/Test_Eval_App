/*
  Warnings:

  - You are about to drop the `ResetPasswordToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwoFactorToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[identifier,token,type]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `VerificationToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `type` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('VerificationEmail', 'ResetPassword', 'TwoFactor');

-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "type" "TokenType" NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ResetPasswordToken";

-- DropTable
DROP TABLE "TwoFactorToken";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_type_key" ON "VerificationToken"("identifier", "token", "type");
