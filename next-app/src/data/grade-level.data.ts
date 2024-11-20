import { prisma } from "@/lib/db";

export const getAllGradeLevelData = async () => {
  return await prisma.gradeLevels.findMany();
};