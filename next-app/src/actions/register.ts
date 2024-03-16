"use server";

import { createUser, getUserByEmail } from "@/data/user-data";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { loginFormSchema } from "@/schema/shema-zod";
import { z } from "zod";

const createNewUser = async ({ email, password }: z.infer<typeof loginFormSchema>) => {
  const isExistingUser = await getUserByEmail(email);

  if (isExistingUser) return { error: "Cette addresse email existe déjà !" };

  try {
    await createUser(email, password);
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);
    return { success: "Un email de comfirmation viens d'être envoyé à cette adresse!" };
  } catch (err) {
    throw err;
  }
};

export default createNewUser;
