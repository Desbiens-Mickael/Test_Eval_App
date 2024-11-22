import { prisma } from "@/lib/db";
import { verificationTokenShema } from "@/type/shema-zod";
import { z } from "zod";

const TYPE = "VerificationEmail";

export const createVerificationtokenData = async (vericationToken: z.infer<typeof verificationTokenShema>) => {
  return await prisma.verificationToken.create({ data: { type: TYPE, ...vericationToken } });
};

export const getVerificationTokenByIdentifierData = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({ where: { identifier: email, type: TYPE } });

    return verificationToken;
  } catch (err) {
    return null;
  }
};

export const getVerificationTokenByTokenData = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({ where: { token: token, type: TYPE } });

    return verificationToken;
  } catch (err) {
    return null;
  }
};

export const deleteVerificationTokenByIdData = async (id: string) => {
  await prisma.verificationToken.delete({ where: { id } });
};
