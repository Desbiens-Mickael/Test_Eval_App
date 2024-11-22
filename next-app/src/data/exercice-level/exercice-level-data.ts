import { prisma } from "@/lib/db";
import { Level } from "@/type/level";

export const getAllExerciceLevelsWithLabelAndColorOnlyData = async (): Promise<Level[]> => {
    return await prisma.exerciceLevel.findMany({ select: {id: true, label: true, color: true } });
};
