import prisma from "@/lib/db";

export const createTwoFactorComfirmationByUserId = async (userId: string) => {
  try {
    return await prisma.twoFactorComfirmation.create({ data: { userId } });
  } catch (error) {
    return null;
  }
};

export const getTwoFactorComfirmationByUserId = async (userId: string) => {
  try {
    return await prisma.twoFactorComfirmation.findUnique({ where: { userId } });
  } catch (error) {
    return null;
  }
};

export const deleteTwoFactorComfirmationById = async (id: string) => {
  await prisma.twoFactorComfirmation.delete({ where: { id } });
};
