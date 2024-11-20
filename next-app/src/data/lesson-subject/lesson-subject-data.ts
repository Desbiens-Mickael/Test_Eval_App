import { prisma } from "@/lib/db";

export const getAllLessonsSubjectData = async () => {
  return await prisma.lessonSubject.findMany();
};

export const getALLLessonSubjectswithLabelAndColorOnlyData = async () => {
  return await prisma.lessonSubject.findMany({ select: {id: true, label: true, color: true } });
};