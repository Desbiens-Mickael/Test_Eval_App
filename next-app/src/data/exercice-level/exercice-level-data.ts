import prisma from "@/lib/db";

export const getAllExerciceLevelsWithLabelAndColorOnly = async () => {
  try {
    return await prisma.exerciceLevel.findMany({ select: { label: true, color: true } });
  } catch (er) {
    console.error(er);
    throw new Error("Error while getting all exercice levels");
  }
};
