"use server";

import {
  createTwoFactorComfirmationByUserIdData,
  deleteTwoFactorComfirmationByIdData,
  getTwoFactorComfirmationByUserIdData,
} from "@/data/two-factor-comfirmation.data";
import {
  deleteTwoFactorTokenByIdData,
  getTwoFactorTokenByIdentifierData,
} from "@/data/two-factor-token.data";
import { getUserByEmailData } from "@/data/user-data";
import {
  checkLoginLock,
  getClientIp,
  recordLoginFailure,
} from "@/lib/login-guard";
import { sendTwoFactorCodeEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { loginUserFormSchema, loginUserFormType } from "@/shema-zod/auth.shema";
import { signIn } from "auth";
import { AuthError } from "next-auth";
import { headers } from "next/headers";

const loginAction = async (credentials: loginUserFormType) => {
  const isCredentialsValide = loginUserFormSchema.safeParse(credentials);

  if (!isCredentialsValide.success) return { error: "Données non valide!" };

  const { email, password, code } = isCredentialsValide.data;

  // Trop d'échecs récents sur ce compte ou depuis cette adresse : bloqué
  const attempt = {
    kind: "user" as const,
    login: email,
    ip: getClientIp(headers()),
  };
  const lock = await checkLoginLock(attempt);
  if (lock) return { error: lock };

  const existingUser = await getUserByEmailData(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    await recordLoginFailure(attempt);
    return { error: "identifiant invalide!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.identifier,
      verificationToken.token
    );
    return {
      success: "Un email de comfirmation viens d'être envoyé à cette adresse.",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByIdentifierData(
        existingUser.email
      );
      // Un code faux compte comme un échec : un code à 6 chiffres
      // ne doit pas pouvoir être deviné en série
      if (!twoFactorToken || twoFactorToken.token !== code) {
        await recordLoginFailure(attempt);
        return { error: "Code non valide!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) return { error: "Code expirer!" };

      await deleteTwoFactorTokenByIdData(twoFactorToken.id);

      const existingTwoFactorComfirmation =
        await getTwoFactorComfirmationByUserIdData(existingUser.id);
      if (existingTwoFactorComfirmation) {
        await deleteTwoFactorComfirmationByIdData(
          existingTwoFactorComfirmation.id
        );
      }

      await createTwoFactorComfirmationByUserIdData(existingUser.id);
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorCodeEmail(
        twoFactorToken.identifier,
        twoFactorToken.token
      );
      return { twoFactor: true };
    }
  }

  // const urlRedirect = "/admin/dashboard";

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      // redirectTo: urlRedirect,
    });

    if (result?.error) {
      return { error: "Une erreur c'est produite !" };
    }

    return { redirect: true };
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

export default loginAction;
