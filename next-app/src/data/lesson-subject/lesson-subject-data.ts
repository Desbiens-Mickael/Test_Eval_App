import { prisma } from "@/lib/db";

export const getAllLessonsSubjectData = async () => {
  return await prisma.lessonSubject.findMany();
};

export const getALLLessonSubjectswithLabelAndColorOnlyData = async () => {
  return await prisma.lessonSubject.findMany({ select: { label: true, color: true } });
};