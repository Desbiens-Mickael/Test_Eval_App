"use server";

import prisma from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";
import { loginFormSchema } from "@/schema/shema-zod";
import { z } from "zod";

const createNewUser = async ({ email, password }: z.infer<typeof loginFormSchema>) => {
  const isExistingUser = await prisma.user.findUnique({ where: { email: email } });

  if (isExistingUser) return { error: "Cette addresse email existe déjà !" };

  try {
    const hashedPassword = await hashPassword(password);
    await prisma.user.create({ data: { email, password: hashedPassword } });
    return { success: "compte créer avec succes !" };
  } catch (err) {
    return { error: "Une erreur c'est produite !" };
  }
};

export default createNewUser;
