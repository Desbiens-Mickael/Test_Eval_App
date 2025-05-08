-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "completionId" TEXT;

-- CreateTable
CREATE TABLE "StudentExercice" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "exerciceId" TEXT,
    "subject" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "note" DOUBLE PRECISION NOT NULL,
    "coeficient" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentExercice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentExercice_studentId_exerciceId_key" ON "StudentExercice"("studentId", "exerciceId");

-- AddForeignKey
ALTER TABLE "StudentExercice" ADD CONSTRAINT "StudentExercice_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExercice" ADD CONSTRAINT "StudentExercice_exerciceId_fkey" FOREIGN KEY ("exerciceId") REFERENCES "Exercice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
