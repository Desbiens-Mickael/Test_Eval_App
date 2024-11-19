"use server";

import { deleteResetEmailTokenByIdData, getResetEmailTokenByTokenData } from "@/data/reset-email-token-data";
import { UpdateUserData, getUserByEmailData } from "@/data/user-data";
import { sendResetEmail } from "@/lib/mail";
import { generateResetEmailToken } from "@/lib/tokens";
import { resetEmailFormSchema } from "@/type/shema-zod";
import { z } from "zod";

// Envoie d'un mail avec un token pour modifier l'adresse email
export const sendResetForEmailAction = async (userEmail: z.infer<typeof resetEmailFormSchema>) => {
  const isEmailValide = resetEmailFormSchema.safeParse(userEmail);
  if (!isEmailValide.success) return { error: "Données non valide!" };

  const { email } = isEmailValide.data;

  const existingUser = await getUserByEmailData(email);
  if (!existingUser) return { error: "Email non valide!" };

  const { token } = await generateResetEmailToken(email);

  await sendResetEmail(email, token);

  return { success: "Un email viens de vous être envoyer" };
};

// Reset de l'adresse email
export const ResetEmailAction = async ({ token, newEmail }: { token: string | null; newEmail: z.infer<typeof resetEmailFormSchema> }) => {
  if (!token) return { error: "Token manquant!" };

  const isResetEmailToken = resetEmailFormSchema.safeParse(newEmail);
  if (!isResetEmailToken.success) return { error: "Données non valide!" };

  const existingResetEmailToken = await getResetEmailTokenByTokenData(token);
  if (!existingResetEmailToken) return { error: "Token non valide!" };

  if (new Date(existingResetEmailToken.expires) < new Date()) return { error: "Token expiré!" };

  const existingUser = await getUserByEmailData(existingResetEmailToken.identifier);
  if (!existingUser) return { error: "Email non valide!" };

  const { email } = isResetEmailToken.data;

  await UpdateUserData(existingUser.id, { email, emailVerified: new Date() });
  await deleteResetEmailTokenByIdData(existingResetEmailToken.id);

  return { success: "Votre adresse email à été modifier avec success." };
};
