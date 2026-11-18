-- Espace parent : un parent (compte PARENT) suit ses enfants en lecture seule.
-- L'e-mail du parent est facultatif sur la fiche élève : renseigné, le compte
-- parent est créé et ses accès envoyés ; vide, aucun accès n'est créé.

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'PARENT';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "parentEmail" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "parentEmailNotifications" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "ParentLink" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParentLink_studentId_idx" ON "ParentLink"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentLink_parentId_studentId_key" ON "ParentLink"("parentId", "studentId");

-- AddForeignKey
ALTER TABLE "ParentLink" ADD CONSTRAINT "ParentLink_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentLink" ADD CONSTRAINT "ParentLink_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

