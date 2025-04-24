-- CreateTable
CREATE TABLE "_GroupToLesson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToLesson_AB_unique" ON "_GroupToLesson"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToLesson_B_index" ON "_GroupToLesson"("B");

-- AddForeignKey
ALTER TABLE "_GroupToLesson" ADD CONSTRAINT "_GroupToLesson_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToLesson" ADD CONSTRAINT "_GroupToLesson_B_fkey" FOREIGN KEY ("B") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
