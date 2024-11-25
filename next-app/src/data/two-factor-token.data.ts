import { prisma } from "@/lib/db";
import { verificationTokenShema } from "@/shema-zod/auth.shema";
import { z } from "zod";

const TYPE = "TwoFactor";

export const createTwoFactorTokenData = async (TwoFactorToken: z.infer<typeof verificationTokenShema>) => {
  return await prisma.verificationToken.create({ data: { type: TYPE, ...TwoFactorToken } });
};

export const getTwoFactorTokenByIdentifierData = async (email: string) => {
  try {
    const TwoFactorToken = await prisma.verificationToken.findFirst({ where: { identifier: email, type: TYPE } });

    return TwoFactorToken;
  } catch (err) {
    return null;
  }
};

export const getTwoFactorTokenByTokenData = async (token: string) => {
  try {
    const TwoFactorToken = await prisma.verificationToken.findUnique({ where: { token: token, type: TYPE } });

    return TwoFactorToken;
  } catch (err) {
    return null;
  }
};

export const deleteTwoFactorTokenByIdData = async (id: string) => {
  await prisma.verificationToken.delete({ where: { id } });
};
