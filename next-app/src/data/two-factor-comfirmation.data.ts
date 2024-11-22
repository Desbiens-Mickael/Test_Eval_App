import { prisma } from "@/lib/db";

export const createTwoFactorComfirmationByUserIdData = async (userId: string) => {
  try {
    return await prisma.twoFactorComfirmation.create({ data: { userId } });
  } catch (error) {
    return null;
  }
};

export const getTwoFactorComfirmationByUserIdData = async (userId: string) => {
  try {
    return await prisma.twoFactorComfirmation.findUnique({ where: { userId } });
  } catch (error) {
    return null;
  }
};

export const deleteTwoFactorComfirmationByIdData = async (id: string) => {
  await prisma.twoFactorComfirmation.delete({ where: { id } });
};
