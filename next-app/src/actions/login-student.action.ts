"use server";

import {
  getStudentByIdentifierlData,
  UpdateStudentData,
} from "@/data/student-data";
import { verifyPassword } from "@/lib/hash-password";
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

  const existingStudent = await getStudentByIdentifierlData(identifier);

  if (
    !existingStudent ||
    !existingStudent.identifier ||
    !existingStudent.password
  ) {
    return { error: "identifiant ou mot de passe invalide !" };
  }

  const veriedPassword = await verifyPassword(
    existingStudent.password,
    password
  );
  if (!veriedPassword) return { error: "Données non valide !" };

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
