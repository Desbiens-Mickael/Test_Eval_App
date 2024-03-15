"use server";

import { createUser } from "@/data/user-data";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";
import { generateVerificationToken } from "@/lib/tokens";
import { loginFormSchema } from "@/schema/shema-zod";
import { z } from "zod";

const createNewUser = async ({ email, password }: z.infer<typeof loginFormSchema>) => {
  const isExistingUser = await prisma.user.findUnique({ where: { email: email } });

  if (isExistingUser) return { error: "Cette addresse email existe déjà !" };

  try {
    const hashedPassword = await hashPassword(password);
    await createUser({ email, hashedPassword });
    // TODO generate verification email
    const token = await generateVerificationToken(email);
    // TODO sent email verification
    return { success: "Un email de comfirmation viens d'être envoyé à cette adresse!" };
  } catch (err) {
    return { error: "Une erreur c'est produite !" };
  }
};

export default createNewUser;
