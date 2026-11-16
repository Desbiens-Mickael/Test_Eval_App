-- CreateEnum
CREATE TYPE "ExerciceKind" AS ENUM ('CONTROL', 'PRACTICE');

-- AlterTable
ALTER TABLE "Exercice" ADD COLUMN     "kind" "ExerciceKind" NOT NULL DEFAULT 'CONTROL';

-- CreateTable
CREATE TABLE "PracticeAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "exerciceId" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "note" DOUBLE PRECISION NOT NULL,
    "coeficient" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PracticeAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeCorrection" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "exerciceId" TEXT NOT NULL,
    "revealedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PracticeCorrection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PracticeAttempt_studentId_exerciceId_idx" ON "PracticeAttempt"("studentId", "exerciceId");

-- CreateIndex
CREATE UNIQUE INDEX "PracticeCorrection_studentId_exerciceId_key" ON "PracticeCorrection"("studentId", "exerciceId");

-- AddForeignKey
ALTER TABLE "PracticeAttempt" ADD CONSTRAINT "PracticeAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeAttempt" ADD CONSTRAINT "PracticeAttempt_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "Exercice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeCorrection" ADD CONSTRAINT "PracticeCorrection_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeCorrection" ADD CONSTRAINT "PracticeCorrection_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "Exercice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
