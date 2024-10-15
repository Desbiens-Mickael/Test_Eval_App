import prisma from "@/lib/db";
import { verificationTokenShema } from "@/type/shema-zod";
import { z } from "zod";

const TYPE = "TwoFactor";

export const createTwoFactorToken = async (TwoFactorToken: z.infer<typeof verificationTokenShema>) => {
  return await prisma.verificationToken.create({ data: { type: TYPE, ...TwoFactorToken } });
};

export const getTwoFactorTokenByIdentifier = async (email: string) => {
  try {
    const TwoFactorToken = await prisma.verificationToken.findFirst({ where: { identifier: email, type: TYPE } });

    return TwoFactorToken;
  } catch (err) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const TwoFactorToken = await prisma.verificationToken.findUnique({ where: { token: token, type: TYPE } });

    return TwoFactorToken;
  } catch (err) {
    return null;
  }
};

export const deleteTwoFactorTokenById = async (id: string) => {
  await prisma.verificationToken.delete({ where: { id } });
};
