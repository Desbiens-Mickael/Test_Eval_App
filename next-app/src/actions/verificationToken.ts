"use server";

import { UpdateUser, getUserByEmail } from "@/data/user-data";
import { getVerificationTokenByToken } from "@/data/verification-token-data";

export const newVerificationToken = async (token: string) => {
  const verificationToken = await getVerificationTokenByToken(token);

  if (!verificationToken) return { error: "Token non valide!" };

  if (new Date(verificationToken.expires) < new Date()) return { error: "Token expiré!" };

  const existingUser = await getUserByEmail(verificationToken.identifier);

  if (!existingUser) return { error: "Email non valide!" };

  await UpdateUser(existingUser.id, { emailVerified: new Date() });

  return { success: "Votre compte est maintenant activé." };
};
