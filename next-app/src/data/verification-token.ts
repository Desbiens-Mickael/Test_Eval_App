import prisma from "@/lib/db";
import { verificationTokenShema } from "@/schema/shema-zod";
import { z } from "zod";

export const createVerificationtoken = async (vericationToken: z.infer<typeof verificationTokenShema>) => {
  return await prisma.verificationToken.create({ data: { ...vericationToken } });
};

export const getVerificationTokenByIdentifier = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({ where: { identifier: email } });

    return verificationToken;
  } catch (err) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({ where: { token: token } });

    return verificationToken;
  } catch (err) {
    return null;
  }
};

export const deleteVerificationTokenByToken = async (token: string) => {
  await prisma.verificationToken.delete({ where: { token } });
};
