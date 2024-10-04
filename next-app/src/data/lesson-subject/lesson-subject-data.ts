import prisma from "@/lib/db";

export const getAllLessonsSubject = async () => {
  try {
    const lessonsSubject = await prisma.lessonSubject.findMany();
    console.log(lessonsSubject);

    return lessonsSubject;
  } catch (er) {
    console.error(er);
    throw new Error("Error while getting all lesson subjects");
  }
};

export const getALLLessonSubjectswithLabelAndColorOnly = async () => {
  try {
    return await prisma.lessonSubject.findMany({ select: { label: true, color: true } });
  } catch (er) {
    console.error(er);
    throw new Error("Error while getting all lesson subjects");
  }
};
