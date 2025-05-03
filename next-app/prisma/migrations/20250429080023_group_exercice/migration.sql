-- CreateTable
CREATE TABLE "_ExerciceToGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciceToGroup_AB_unique" ON "_ExerciceToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciceToGroup_B_index" ON "_ExerciceToGroup"("B");

-- AddForeignKey
ALTER TABLE "_ExerciceToGroup" ADD CONSTRAINT "_ExerciceToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciceToGroup" ADD CONSTRAINT "_ExerciceToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
