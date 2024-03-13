import { compare, hash } from "bcryptjs";

const saltRound = 10;

/**
 *
 * @param plain: string
 * @returns hashedPassword: string
 * @example const hashedPassword = await hashPassword(password);
 */
export const hashPassword = async (plain: string): Promise<string> => {
  const hashedPassword = await hash(plain, saltRound);

  return hashedPassword;
};

export const verifyPassword = async (hashPassword: string, plain: string): Promise<boolean> => {
  return await compare(plain, hashPassword);
};
