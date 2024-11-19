"use server";

import { UpdateUserData, getUserByEmailData } from "@/data/user-data";
import { getVerificationTokenByTokenData } from "@/data/verification-token-data";

export const newVerificationTokenAction = async (token: string) => {
  const verificationToken = await getVerificationTokenByTokenData(token);

  if (!verificationToken) return { error: "Token non valide!" };

  if (new Date(verificationToken.expires) < new Date()) return { error: "Token expiré!" };

  const existingUser = await getUserByEmailData(verificationToken.identifier);

  if (!existingUser) return { error: "Email non valide!" };

  await UpdateUserData(existingUser.id, { emailVerified: new Date() });

  return { success: "Votre compte est maintenant activé." };
};
