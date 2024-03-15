"use server";

import { loginFormSchema } from "@/schema/shema-zod";
import { signIn } from "auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const login = async (credentials: z.infer<typeof loginFormSchema>) => {
  const isCredentialsValide = loginFormSchema.safeParse(credentials);

  if (!isCredentialsValide.success) return { error: "Données non valide!" };

  const { email, password } = isCredentialsValide.data;
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
