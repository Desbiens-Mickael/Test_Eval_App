import { createResetEmailTokenData, deleteResetEmailTokenByIdData, getResetEmailTokenByIdentifierData } from "@/data/reset-email-token-data";
import { createResetPasswordTokenData, deleteResetPasswordTokenByIdData, getResetPasswordTokenByIdentifierData } from "@/data/reset-password-token-data";
import { createTwoFactorTokenData, deleteTwoFactorTokenByIdData, getTwoFactorTokenByIdentifierData } from "@/data/two-factor-token.data";
import { createVerificationtokenData, deleteVerificationTokenByIdData, getVerificationTokenByIdentifierData } from "@/data/verification-token-data";
import crypto from "crypto";
import { v4 as uuidV4 } from "uuid";

// Génère un token de vérification de l'adresse email
export const generateVerificationToken = async (email: string) => {
  const token = uuidV4();
  const dateExpire = new Date(new Date().getTime() + 3600 * 1000);

  const isExistingToken = await getVerificationTokenByIdentifierData(email);

  if (isExistingToken) {
    await deleteVerificationTokenByIdData(isExistingToken.id);
  }

  return await createVerificationtokenData({ token, identifier: email, expires: dateExpire });
};

// Génère un token pour le reset du password
export const generateResetPasswordToken = async (email: string) => {
  const token = uuidV4();
  const dateExpire = new Date(new Date().getTime() + 3600 * 1000);

  const isExistingToken = await getResetPasswordTokenByIdentifierData(email);

  if (isExistingToken) {
    await deleteResetPasswordTokenByIdData(isExistingToken.id);
  }

  return await createResetPasswordTokenData({ token, identifier: email, expires: dateExpire });
};

// Génère un token pour le reset de l'adresse email
export const generateResetEmailToken = async (email: string) => {
  const token = uuidV4();
  const dateExpire = new Date(new Date().getTime() + 3600 * 1000);

  const isExistingToken = await getResetEmailTokenByIdentifierData(email);

  if (isExistingToken) {
    await deleteResetEmailTokenByIdData(isExistingToken.id);
  }

  return await createResetEmailTokenData({ token, identifier: email, expires: dateExpire });
};

// Génère un token pour l'authentification à deux facteurs
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const dateExpire = new Date(new Date().getTime() + 5 * 60 * 1000);

  const isExistingToken = await getTwoFactorTokenByIdentifierData(email);

  if (isExistingToken) {
    await deleteTwoFactorTokenByIdData(isExistingToken.id);
  }

  return await createTwoFactorTokenData({ token, identifier: email, expires: dateExpire });
};
