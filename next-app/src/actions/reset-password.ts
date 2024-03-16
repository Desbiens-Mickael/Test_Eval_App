"use server";

import { deleteResetPasswordTokenByToken, getResetPasswordTokenByToken } from "@/data/reset-password-token-data";
import { UpdateUser, getUserByEmail } from "@/data/user-data";
import { hashPassword } from "@/lib/hash-password";
import { sendResetPasswordEmail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/tokens";
import { resetPasswordFormSchema, resetPasswordSendFormSchema } from "@/schema/shema-zod";
import { z } from "zod";

export const newResetPassword = async (token: string | null, newPassword: z.infer<typeof resetPasswordFormSchema>) => {
  if (!token) return { error: "Token manquant!" };

  const isResetPaswordToken = resetPasswordFormSchema.safeParse(newPassword);
  if (!isResetPaswordToken.success) return { error: "Données non valide!" };

  const existingResetPasswordToken = await getResetPasswordTokenByToken(token);
  if (!existingResetPasswordToken) return { error: "Token non valide!" };

  if (new Date(existingResetPasswordToken.expires) < new Date()) return { error: "Token expiré!" };

  const existingUser = await getUserByEmail(existingResetPasswordToken.identifier);
  if (!existingUser) return { error: "Email non valide!" };

  const { password } = isResetPaswordToken.data;
  const newPasswordHashed = await hashPassword(password);

  await UpdateUser(existingUser.id, { password: newPasswordHashed });
  await deleteResetPasswordTokenByToken(existingResetPasswordToken.token);

  return { success: "Votre mot de passe à été modifier avec success." };
};

export const resetPassword = async (userEmail: z.infer<typeof resetPasswordSendFormSchema>) => {
  const isEmailValide = resetPasswordSendFormSchema.safeParse(userEmail);
  if (!isEmailValide.success) return { error: "Données non valide!" };

  const { email } = isEmailValide.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) return { error: "Email non valide!" };

  const { token } = await generateResetPasswordToken(email);

  await sendResetPasswordEmail(email, token);

  return { success: "Un email viens de vous être envoyer" };
};
