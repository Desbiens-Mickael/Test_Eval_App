"use server";

import { deleteResetPasswordTokenByIdData, getResetPasswordTokenByTokenData } from "@/data/reset-password-token-data";
import { UpdateUserData, getUserByEmailData } from "@/data/user-data";
import { hashPassword } from "@/lib/hash-password";
import { sendResetPasswordEmail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/tokens";
import { resetPasswordFormSchema, resetPasswordSendFormSchema } from "@/shema-zod/auth.shema";
import { z } from "zod";

// Envoie d'un mail pour reset le password
export const resetPasswordAction = async (userEmail: z.infer<typeof resetPasswordSendFormSchema>) => {
  const isEmailValide = resetPasswordSendFormSchema.safeParse(userEmail);
  if (!isEmailValide.success) return { error: "Données non valide!" };

  const { email } = isEmailValide.data;

  const existingUser = await getUserByEmailData(email);
  if (!existingUser) return { error: "Email non valide!" };

  const { token } = await generateResetPasswordToken(email);

  await sendResetPasswordEmail(email, token);

  return { success: "Un email viens de vous être envoyer" };
};

// Reset du password
export const newResetPasswordAction = async ({ token, newPassword }: { token: string | null; newPassword: z.infer<typeof resetPasswordFormSchema> }) => {
  if (!token) return { error: "Token manquant!" };

  const isResetPaswordToken = resetPasswordFormSchema.safeParse(newPassword);
  if (!isResetPaswordToken.success) return { error: "Données non valide!" };

  const existingResetPasswordToken = await getResetPasswordTokenByTokenData(token);
  if (!existingResetPasswordToken) return { error: "Token non valide!" };

  if (new Date(existingResetPasswordToken.expires) < new Date()) return { error: "Token expiré!" };

  const existingUser = await getUserByEmailData(existingResetPasswordToken.identifier);
  if (!existingUser) return { error: "Email non valide!" };

  const { password } = isResetPaswordToken.data;
  const newPasswordHashed = await hashPassword(password);

  await UpdateUserData(existingUser.id, { password: newPasswordHashed });
  await deleteResetPasswordTokenByIdData(existingResetPasswordToken.id);

  return { success: "Votre mot de passe à été modifier avec success." };
};
