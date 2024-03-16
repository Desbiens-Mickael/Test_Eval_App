import { createResetPasswordToken, deleteResetPasswordTokenByToken, getResetPasswordTokenByIdentifier } from "@/data/reset-password-token-data";
import { createVerificationtoken, deleteVerificationTokenByToken, getVerificationTokenByIdentifier } from "@/data/verification-token-data";
import { v4 as uuidV4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidV4();
  const dateExpire = new Date(new Date().getTime() + 3600 * 1000);

  const isExistingToken = await getVerificationTokenByIdentifier(email);

  if (isExistingToken) {
    await deleteVerificationTokenByToken(isExistingToken.token);
  }

  return await createVerificationtoken({ token, identifier: email, expires: dateExpire });
};

export const generateResetPasswordToken = async (email: string) => {
  const token = uuidV4();
  const dateExpire = new Date(new Date().getTime() + 3600 * 1000);

  const isExistingToken = await getResetPasswordTokenByIdentifier(email);

  if (isExistingToken) {
    await deleteResetPasswordTokenByToken(isExistingToken.token);
  }

  return await createResetPasswordToken({ token, identifier: email, expires: dateExpire });
};
