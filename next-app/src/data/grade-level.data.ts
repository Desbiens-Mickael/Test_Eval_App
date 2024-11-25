import { prisma } from "@/lib/db";

export const getAllGradeLevelsWithLabelAndColorOnlyData = async () => {
  return await prisma.gradeLevels.findMany({ select: {id: true, label: true, color: true } });
};