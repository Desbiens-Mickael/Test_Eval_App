import prisma from "@/lib/db";
import { resetPasswordTokenShema } from "@/schema/shema-zod";
import { z } from "zod";

export const createResetPasswordToken = async (resetPasswordToken: z.infer<typeof resetPasswordTokenShema>) => {
  return await prisma.resetPasswordToken.create({ data: { ...resetPasswordToken } });
};

export const getResetPasswordTokenByIdentifier = async (email: string) => {
  try {
    const resetPasswordToken = await prisma.resetPasswordToken.findFirst({ where: { identifier: email } });

    return resetPasswordToken;
  } catch (err) {
    return null;
  }
};

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    const resetPasswordToken = await prisma.resetPasswordToken.findUnique({ where: { token: token } });

    return resetPasswordToken;
  } catch (err) {
    return null;
  }
};

export const deleteResetPasswordTokenByToken = async (token: string) => {
  await prisma.resetPasswordToken.delete({ where: { token } });
};
