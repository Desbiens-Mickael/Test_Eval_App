import prisma from "@/lib/db";
import { ExerciceType } from "@prisma/client";

export const getAllExercice = async () => {
  return await prisma.exercice.findMany({
    select: {
      id: true,
      title: true,
      lesson: {
        select: {
          name: true,
          LessonSubject: {
            select: { label: true },
          },
        },
      },
      level: {
        select: {
          label: true,
        },
      },
    },
  });
};

export const getAllExerciceByType = async (type: ExerciceType) => {
  return await prisma.exercice.findMany({
    where: {
      type: type,
    },
    select: {
      id: true,
      title: true,
      lesson: {
        select: {
          name: true,
          LessonSubject: {
            select: { label: true },
          },
        },
      },
      level: {
        select: {
          label: true,
        },
      },
    },
  });
};

export const getExerciceById = async (id: string) => {
  return await prisma.exercice.findUnique({ where: { id } });
};

export const updateExercice = async (id: string, data: object) => {
  return await prisma.exercice.update({ where: { id: id }, data: { ...data } });
};

export const deleteExerciceById = async (id: string) => {
  await prisma.exercice.delete({ where: { id } });
};
