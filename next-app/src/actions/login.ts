"use server";

import { getUserByEmail } from "@/data/user-data";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { loginFormSchema } from "@/schema/shema-zod";
import { signIn } from "auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const login = async (credentials: z.infer<typeof loginFormSchema>) => {
  const isCredentialsValide = loginFormSchema.safeParse(credentials);

  if (!isCredentialsValide.success) return { error: "Données non valide!" };

  const { email, password } = isCredentialsValide.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "identifiant invalide!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(existingUser.email, verificationToken.token);
    return { success: "Un email de comfirmation viens d'être envoyé à cette adresse!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Identifiants non valide!" };
        default:
          return { error: "Une erreur c'est produite!" };
      }
    }

    throw err;
  }
};

export default login;
