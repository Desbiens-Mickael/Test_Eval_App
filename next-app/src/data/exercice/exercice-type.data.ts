import { prisma } from "@/lib/db";

export const getAllExerciceTypeData = async () => {
  return await prisma.exerciceType.findMany({
    select: { id: true, name: true },
  });
};

export const getExerciceTypeByNameData = async (name: string) => {
  return await prisma.exerciceType.findUnique({ where: { name } });
};

export const getExerciceTypeByIdData = async (id: string) => {
  return await prisma.exerciceType.findUnique({ where: { id } });
};
