import { prisma } from "@/lib/db";
import { verificationTokenShema } from "@/type/shema-zod";
import { z } from "zod";

const TYPE = "ResetPassword";

export const createResetPasswordTokenData = async (resetPasswordToken: z.infer<typeof verificationTokenShema>) => {
  return await prisma.verificationToken.create({ data: { type: TYPE, ...resetPasswordToken } });
};

export const getResetPasswordTokenByIdentifierData = async (email: string) => {
  try {
    return prisma.verificationToken.findFirst({ where: { identifier: email, type: TYPE } });
  } catch (err) {
    return null;
  }
};

export const getResetPasswordTokenByTokenData = async (token: string) => {
  try {
    return await prisma.verificationToken.findUnique({ where: { token: token, type: TYPE } });
  } catch (err) {
    return null;
  }
};

export const deleteResetPasswordTokenByIdData = async (id: string) => {
  await prisma.verificationToken.delete({ where: { id } });
};
