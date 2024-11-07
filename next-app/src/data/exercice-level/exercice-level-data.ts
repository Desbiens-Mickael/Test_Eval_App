import { prisma } from "@/lib/db";
import { Level } from "@/type/level";

export const getAllExerciceLevelsWithLabelAndColorOnly = async (): Promise<Level[]> => {
  try {
    return await prisma.exerciceLevel.findMany({ select: { label: true, color: true } });
  } catch (er) {
    console.error(er);
    throw new Error("Error while getting all exercice levels");
  }
};
