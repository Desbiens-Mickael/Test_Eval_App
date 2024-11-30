import { prisma } from "@/lib/db";

export const getExerciceTypeByNameData = async (name: string) => {
  return await prisma.exerciceType.findUnique({ where: { name } });
};
