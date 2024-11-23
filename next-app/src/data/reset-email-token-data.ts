import { prisma } from "@/lib/db";
import { verificationTokenShema } from "@/shema-zod/auth.shema";
import { z } from "zod";

const TYPE = "ResetEmail";

export const createResetEmailTokenData = async (resetEmailToken: z.infer<typeof verificationTokenShema>) => {
  return await prisma.verificationToken.create({ data: { type: TYPE, ...resetEmailToken } });
};

export const getResetEmailTokenByIdentifierData = async (email: string) => {
  try {
    return prisma.verificationToken.findFirst({ where: { identifier: email, type: TYPE } });
  } catch (err) {
    return null;
  }
};

export const getResetEmailTokenByTokenData = async (token: string) => {
  try {
    return await prisma.verificationToken.findUnique({ where: { token: token, type: TYPE } });
  } catch (err) {
    return null;
  }
};

export const deleteResetEmailTokenByIdData = async (id: string) => {
  await prisma.verificationToken.delete({ where: { id } });
};
