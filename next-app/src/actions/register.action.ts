"use server";

import { createUserData, getUserByEmailData } from "@/data/user-data";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { capitalize } from "@/lib/utils";
import { registerFormSchema } from "@/shema-zod/auth.shema";
import { z } from "zod";

const createNewUserAction = async (credentials: z.infer<typeof registerFormSchema>) => {
  const valuesVerified = registerFormSchema.safeParse(credentials);
  if (!valuesVerified.success) return { error: "Données non valide!" };

  const { firstname, lastname, email, password } = valuesVerified.data;
  const fullName = `${capitalize(firstname)} ${capitalize(lastname)}`;
  const isExistingUser = await getUserByEmailData(email);

  if (isExistingUser) return { error: "Cette addresse email existe déjà !" };

  try {
    await createUserData(email, password, fullName);
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);
    return { success: "Un email de comfirmation viens d'être envoyé à cette adresse!" };
  } catch (err) {
    throw err;
  }
};

export default createNewUserAction;
