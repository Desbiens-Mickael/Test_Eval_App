import { z } from "zod";

export const registerFormSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email({ message: "addresse email invalide" }),
    password: z.string().min(6, { message: "minimum 6 caractère" }),
  })
  .required();

export const loginFormSchema = registerFormSchema.omit({ firstname: true, lastname: true }).extend({ code: z.optional(z.string()) });

export const resetPasswordSendFormSchema = registerFormSchema.pick({ email: true });

export const resetPasswordFormSchema = registerFormSchema.pick({ password: true });

export const verificationTokenShema = z
  .object({
    identifier: z.string().email(),
    token: z.string(),
    expires: z.date(),
  })
  .required();
