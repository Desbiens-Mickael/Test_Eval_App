-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'CORRECTION';

-- AlterTable
ALTER TABLE "StudentExercice" ADD COLUMN     "autoNote" DOUBLE PRECISION,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "teacherComment" TEXT;

-- AlterTable
ALTER TABLE "_ExerciceToGroup" ADD CONSTRAINT "_ExerciceToGroup_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ExerciceToGroup_AB_unique";

-- AlterTable
ALTER TABLE "_GroupToLesson" ADD CONSTRAINT "_GroupToLesson_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_GroupToLesson_AB_unique";
