import { createResetEmailToken, deleteResetEmailTokenById, getResetEmailTokenByIdentifier } from "@/data/reset-email-token-data";
import { createResetPasswordToken, deleteResetPasswordTokenById, getResetPasswordTokenByIdentifier } from "@/data/reset-password-token-data";
import { createTwoFactorToken, deleteTwoFactorTokenById, getTwoFactorTokenByIdentifier } from "@/data/two-factor-token";
import { createVerificationtoken, deleteVerificationTokenById, getVerificationTokenByIdentifier } from "@/data/verification-token-data";
import crypto from "crypto";
import { v4 as uuidV4 } from "uuid";

// Génère un token de vérification de l'adresse email
export const generateVerificationToken = async (email: string) => {
  const token = uuidV4();
  const dateExpire = new Date(new Date().getTime() + 3600 * 1000);

  const isExistingToken = await getVerificationTokenByIdentifier(email);

  if (isExistingToken) {
    await deleteVerificationTokenById(isExistingToken.id);
  }

  return await createVerificationtoken({ token, identifier: email, expires: dateExpire });
};

// Génère un token pour le reset du password
export const generateResetPasswordToken = async (email: string) => {
  const token = uuidV4();
  const dateExpire = new Date(new Date().getTime() + 3600 * 1000);

  const isExistingToken = await getResetPasswordTokenByIdentifier(email);

  if (isExistingToken) {
    await deleteResetPasswordTokenById(isExistingToken.id);
  }

  return await createResetPasswordToken({ token, identifier: email, expires: dateExpire });
};

// Génère un token pour le reset de l'adresse email
export const generateResetEmailToken = async (email: string) => {
  const token = uuidV4();
  const dateExpire = new Date(new Date().getTime() + 3600 * 1000);

  const isExistingToken = await getResetEmailTokenByIdentifier(email);

  if (isExistingToken) {
    await deleteResetEmailTokenById(isExistingToken.id);
  }

  return await createResetEmailToken({ token, identifier: email, expires: dateExpire });
};

// Génère un token pour l'authentification à deux facteurs
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const dateExpire = new Date(new Date().getTime() + 5 * 60 * 1000);

  const isExistingToken = await getTwoFactorTokenByIdentifier(email);

  if (isExistingToken) {
    await deleteTwoFactorTokenById(isExistingToken.id);
  }

  return await createTwoFactorToken({ token, identifier: email, expires: dateExpire });
};
