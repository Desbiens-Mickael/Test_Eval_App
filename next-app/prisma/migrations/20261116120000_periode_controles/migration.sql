-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'RESULTS';

-- AlterTable
ALTER TABLE "Exercice" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "closesAt" TIMESTAMP(3),
ADD COLUMN     "opensAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "StudentExercice" ADD COLUMN     "isMissing" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Exercice_kind_closedAt_closesAt_idx" ON "Exercice"("kind", "closedAt", "closesAt");
