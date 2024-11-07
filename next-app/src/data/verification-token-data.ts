import { prisma } from "@/lib/db";
import { verificationTokenShema } from "@/type/shema-zod";
import { z } from "zod";

const TYPE = "VerificationEmail";

export const createVerificationtoken = async (vericationToken: z.infer<typeof verificationTokenShema>) => {
  return await prisma.verificationToken.create({ data: { type: TYPE, ...vericationToken } });
};

export const getVerificationTokenByIdentifier = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({ where: { identifier: email, type: TYPE } });

    return verificationToken;
  } catch (err) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({ where: { token: token, type: TYPE } });

    return verificationToken;
  } catch (err) {
    return null;
  }
};

export const deleteVerificationTokenById = async (id: string) => {
  await prisma.verificationToken.delete({ where: { id } });
};
