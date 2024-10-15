"use server";

import { createTwoFactorComfirmationByUserId, deleteTwoFactorComfirmationById, getTwoFactorComfirmationByUserId } from "@/data/two-factor-comfirmation";
import { deleteTwoFactorTokenById, getTwoFactorTokenByIdentifier } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user-data";
import { sendTwoFactorCodeEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { loginFormSchema } from "@/type/shema-zod";
import { signIn } from "auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const login = async (credentials: z.infer<typeof loginFormSchema>) => {
  const isCredentialsValide = loginFormSchema.safeParse(credentials);

  if (!isCredentialsValide.success) return { error: "Données non valide!" };

  const { email, password, code } = isCredentialsValide.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "identifiant invalide!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);
    return { success: "Un email de comfirmation viens d'être envoyé à cette adresse." };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByIdentifier(existingUser.email);
      if (!twoFactorToken || twoFactorToken.token !== code) return { error: "Code non valide!" };

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) return { error: "Code expirer!" };

      await deleteTwoFactorTokenById(twoFactorToken.id);

      const existingTwoFactorComfirmation = await getTwoFactorComfirmationByUserId(existingUser.id);
      if (existingTwoFactorComfirmation) {
        await deleteTwoFactorComfirmationById(existingTwoFactorComfirmation.id);
      }

      await createTwoFactorComfirmationByUserId(existingUser.id);
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorCodeEmail(twoFactorToken.identifier, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  const urlRedirect = existingUser.role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: urlRedirect,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Identifiants non valide!" };
        default:
          return { error: "Une erreur c'est produite!!" };
      }
    }

    throw err;
  }
};

export default login;
