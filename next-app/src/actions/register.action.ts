"use server";

import {
  createStudentData,
  getCountAllStudentsByIdentifierData,
} from "@/data/student-data";
import { createUserData, getUserByEmailData } from "@/data/user-data";
import { currentUser } from "@/lib/auth";
import { sendCredentialStudentEmail, sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { capitalize, generateTemporaryPassword } from "@/lib/utils";
import {
  registerStudentFormSchema,
  registerStudentFormType,
  registerUserFormSchema,
  registerUserFormType,
} from "@/shema-zod/auth.shema";

export const createNewUserAction = async (
  credentials: registerUserFormType
) => {
  const valuesVerified = registerUserFormSchema.safeParse(credentials);
  if (!valuesVerified.success) return { error: "Données non valide!" };

  const { firstname, lastname, email, password } = valuesVerified.data;
  const fullName = `${capitalize(firstname)} ${capitalize(lastname)}`;
  const isExistingUser = await getUserByEmailData(email);

  if (isExistingUser) return { error: "Cette addresse email existe déjà !" };

  try {
    await createUserData(email, password, fullName);
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);
    return {
      success: "Un email de comfirmation viens d'être envoyé à cette adresse !",
    };
  } catch (err) {
    throw err;
  }
};

export const createNewStudentAction = async (
  credentials: registerStudentFormType
) => {
  const valuesVerified = registerStudentFormSchema.safeParse(credentials);
  if (!valuesVerified.success) return { error: "Données non valide!" };

  // récupère l'utilisateur
  const user = await currentUser();
  if (!user || !user.id || !user.email || user.role !== "ADMIN")
    return { error: "Action non autoriser !" };

  const { firstname, lastname } = valuesVerified.data;
  let identifier = `${firstname.charAt(0)}.${lastname}`.toLowerCase();
  // récupérer en bdd le compte des utilisateurs avec l'identifiant, si compte > 0 on ajoute 02, 03, 04, 05... au autre identifiant identique
  const countStudent = await getCountAllStudentsByIdentifierData(identifier);
  if (countStudent > 0) {
    // Formater le numéro avec deux chiffres en ajoutant 1 pour éviter 00
    const suffix = String(countStudent + 1).padStart(2, "0");
    identifier = `${identifier}-${suffix}`;
  }

  try {
    const password = generateTemporaryPassword();
    const student = await createStudentData(
      user.id,
      identifier,
      password,
      firstname,
      lastname
    );

    if (!student) return { error: "Une erreur c'est produite !" };

    // Envoyer l'email contenant les informations de connexion
    await sendCredentialStudentEmail(
      user.email,
      firstname,
      lastname,
      identifier,
      password
    );

    return {
      success: `Un email contenant les informations de connexion pour ${firstname} ${lastname} viens de vous etre envoyé !`,
    };
  } catch (error) {
    throw error;
  }
};
