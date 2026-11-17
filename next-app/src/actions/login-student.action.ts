"use server";

import {
  getStudentByIdentifierlData,
  UpdateStudentData,
} from "@/data/student-data";
import { verifyPassword } from "@/lib/hash-password";
import {
  checkLoginLock,
  getClientIp,
  recordLoginFailure,
} from "@/lib/login-guard";
import { headers } from "next/headers";
import {
  loginStudentFormSchema,
  loginStudentFormType,
} from "@/shema-zod/auth.shema";
import { signIn } from "auth";
import { AuthError } from "next-auth";

const loginStudentAction = async (credentials: loginStudentFormType) => {
  const isCredentialsValide = loginStudentFormSchema.safeParse(credentials);

  if (!isCredentialsValide.success) return { error: "Données non valide!" };

  const { identifier, password } = isCredentialsValide.data;

  // Trop d'échecs récents sur ce compte ou depuis cette adresse : bloqué
  const attempt = {
    kind: "student" as const,
    login: identifier,
    ip: getClientIp(headers()),
  };
  const lock = await checkLoginLock(attempt);
  if (lock) return { error: lock };

  const existingStudent = await getStudentByIdentifierlData(identifier);

  // Même message et même comptage, que l'identifiant existe ou non
  const veriedPassword =
    !!existingStudent?.password &&
    (await verifyPassword(existingStudent.password, password));
  if (!existingStudent || !veriedPassword) {
    await recordLoginFailure(attempt);
    return { error: "Identifiant ou mot de passe invalide !" };
  }

  // Compte désactivé par le professeur (vérifié après le mot de passe,
  // pour ne pas révéler l'état d'un compte à quelqu'un qui devine)
  if (existingStudent.disabledAt) {
    return {
      error: "Ton compte est désactivé. Demande à ton professeur de le réactiver.",
    };
  }

  if (existingStudent.isActive === false) {
    await UpdateStudentData(existingStudent.id, { isActive: true });
  }

  try {
    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Une erreur c'est produite !" };
    }

    return { redirect: true };
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "Identifiants ou mot de passe non valide!" };
        default:
          return { error: "Une erreur c'est produite !!" };
      }
    }

    throw err;
  }
};

export default loginStudentAction;
