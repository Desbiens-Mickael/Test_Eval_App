import { string, z } from "zod";

export const loginFormSchema = z
  .object({
    email: z.string().email({ message: "addresse email invalide" }),
    password: z.string().min(6, { message: "minimum 6 caractère" }),
  })
  .required();

export const resetPasswordSendFormSchema = loginFormSchema.pick({ email: true });

export const resetPasswordFormSchema = loginFormSchema.pick({ password: true });

export const verificationTokenShema = z
  .object({
    identifier: z.string().email(),
    token: z.string(),
    expires: z.date(),
  })
  .required();

export const resetPasswordTokenShema = verificationTokenShema;
