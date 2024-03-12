import { Options, argon2id, hash, verify } from "argon2";

const hashOptions: Options & { raw?: false } = {
  type: argon2id,
  memoryCost: 2 ** 16,
};

/**
 *
 * @param plain: string
 * @returns hashedPassword: string
 * @example const hashedPassword = await hashPassword(password);
 */
export const hashPassword = async (plain: string): Promise<string> => {
  const hashedPassword = await hash(plain, hashOptions);

  return hashedPassword;
};

export const verifyPassword = async (hashPassword: string, plain: string): Promise<boolean> => {
  return await verify(hashPassword, plain);
};
