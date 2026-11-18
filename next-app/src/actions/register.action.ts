"use server";

import { applyStudentParentEmail } from "@/lib/parent-access";
import { parentEmailShema } from "@/shema-zod/parent.shema";
import {
  createStudentData,
  getTakenIdentifiersData,
} from "@/data/student-data";
import { createUserData, getUserByEmailData } from "@/data/user-data";
import { currentUser } from "@/lib/auth";
import { sendCredentialStudentEmail, sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { assignIdentifiers, buildIdentifierBase } from "@/lib/student-import";
import { generateStudentPassword } from "@/lib/student-password";
import { capitalize } from "@/lib/utils";
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
  // Identifiant sans accents ni espaces ; s'il est pris : -02, -03… (premier numéro libre)
  const base = buildIdentifierBase(firstname, lastname);
  if (!/^[a-z]\.[a-z]/.test(base)) return { error: "Nom ou prénom invalide !" };
  const [identifier] = assignIdentifiers([base], await getTakenIdentifiersData([base]));

  try {
    const password = generateStudentPassword();
    const name = `${capitalize(firstname)} ${capitalize(lastname)}`;
    const student = await createStudentData(
      user.id,
      identifier,
      password,
      name
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

    // E-mail du parent renseigné : son espace est créé et ses accès envoyés
    let parentMessage = "";
    const parentEmail = parentEmailShema.safeParse(valuesVerified.data.parentEmail);
    if (parentEmail.success && parentEmail.data) {
      const parent = await applyStudentParentEmail({
        studentId: student.id,
        studentName: name,
        email: parentEmail.data,
        teacherEmail: user.email,
      });
      parentMessage = " " + ("error" in parent ? `Espace parent non créé : ${parent.error}` : parent.message);
    }

    return {
      success: `Un email contenant les informations de connexion pour ${firstname} ${lastname} viens de vous etre envoyé !${parentMessage}`,
      data: {
        authorId: user.id,
        identifier,
        password,
        name,
      },
    };
  } catch (error) {
    throw error;
  }
};
