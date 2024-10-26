import { prisma } from "@/lib/db";
import { verificationTokenShema } from "@/type/shema-zod";
import { z } from "zod";

const TYPE = "ResetEmail";

export const createResetEmailToken = async (resetEmailToken: z.infer<typeof verificationTokenShema>) => {
  return await prisma.verificationToken.create({ data: { type: TYPE, ...resetEmailToken } });
};

export const getResetEmailTokenByIdentifier = async (email: string) => {
  try {
    return prisma.verificationToken.findFirst({ where: { identifier: email, type: TYPE } });
  } catch (err) {
    return null;
  }
};

export const getResetEmailTokenByToken = async (token: string) => {
  try {
    return await prisma.verificationToken.findUnique({ where: { token: token, type: TYPE } });
  } catch (err) {
    return null;
  }
};

export const deleteResetEmailTokenById = async (id: string) => {
  await prisma.verificationToken.delete({ where: { id } });
};
