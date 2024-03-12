import { z } from "zod";

export const loginFormSchema = z
  .object({
    email: z.string().email({ message: "addresse email invalide" }),
    password: z.string().min(6, { message: "minimum 6 caractère" }),
  })
  .required();
