"use server";

import { deleteResetEmailTokenById, getResetEmailTokenByToken } from "@/data/reset-email-token-data";
import { UpdateUser, getUserByEmail } from "@/data/user-data";
import { sendResetEmail } from "@/lib/mail";
import { generateResetEmailToken } from "@/lib/tokens";
import { resetEmailFormSchema } from "@/schema/shema-zod";
import { z } from "zod";

// Envoie d'un mail pour reset le Email
export const sendResetForEmail = async (userEmail: z.infer<typeof resetEmailFormSchema>) => {
  const isEmailValide = resetEmailFormSchema.safeParse(userEmail);
  if (!isEmailValide.success) return { error: "Données non valide!" };

  const { email } = isEmailValide.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) return { error: "Email non valide!" };

  const { token } = await generateResetEmailToken(email);

  await sendResetEmail(email, token);

  return { success: "Un email viens de vous être envoyer" };
};

// Reset du Email
export const ResetEmail = async ({ token, newEmail }: { token: string | null; newEmail: z.infer<typeof resetEmailFormSchema> }) => {
  if (!token) return { error: "Token manquant!" };

  const isResetEmailToken = resetEmailFormSchema.safeParse(newEmail);
  if (!isResetEmailToken.success) return { error: "Données non valide!" };

  const existingResetEmailToken = await getResetEmailTokenByToken(token);
  if (!existingResetEmailToken) return { error: "Token non valide!" };

  if (new Date(existingResetEmailToken.expires) < new Date()) return { error: "Token expiré!" };

  const existingUser = await getUserByEmail(existingResetEmailToken.identifier);
  if (!existingUser) return { error: "Email non valide!" };

  const { email } = isResetEmailToken.data;

  await UpdateUser(existingUser.id, { email, emailVerified: new Date() });
  await deleteResetEmailTokenById(existingResetEmailToken.id);

  return { success: "Votre adresse email à été modifier avec success." };
};
