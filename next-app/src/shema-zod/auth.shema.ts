import { UserRole } from "@prisma/client";
import { z } from "zod";

export const registerUserFormSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email({ message: "adresse email invalide" }),
    password: z.string().min(6, { message: "minimum 6 caractère" }),
  })
  .required();

export const registerStudentFormSchema = registerUserFormSchema.omit({
  email: true,
  password: true,
});

export const loginUserFormSchema = registerUserFormSchema
  .omit({ firstname: true, lastname: true })
  .extend({ code: z.optional(z.string()) });

export const loginStudentFormSchema = z.object({
  identifier: z.string({ required_error: "Identifiant requis" }),
  password: z.string().min(8, { message: "minimum 8 caractère" }),
});

export const resetPasswordSendFormSchema = registerUserFormSchema.pick({
  email: true,
});

export const resetPasswordFormSchema = registerUserFormSchema.pick({
  password: true,
});

export const resetEmailFormSchema = registerUserFormSchema.pick({
  email: true,
});

export const verificationTokenShema = z
  .object({
    identifier: z.string().email(),
    token: z.string(),
    expires: z.date(),
  })
  .required();

export const userInfosFormSchema = z.object({
  firstname: z.optional(
    z.string().min(2, {
      message: "Votre prénom doit comporter au moins 2 caractères!",
    })
  ),
  lastname: z.optional(
    z.string().min(2, {
      message: "Votre nom doit comporter au moins 2 caractères!",
    })
  ),
  email: z.optional(
    z.string().email({
      message: "Adresse email non valide!",
    })
  ),
  role: z.enum([UserRole.ADMIN, UserRole.USER, UserRole.STUDENT]),
});

export const userPreferencesFormSchema = z.object({
  imgPath: z.optional(z.string()),
});

export const userSecurityFormSchema = z
  .object({
    password: z.optional(
      z.string().min(6, {
        message: "Minimum 6 caractère!",
      })
    ),
    newPassword: z.optional(
      z.string().min(6, {
        message: "Minimum 6 caractère!",
      })
    ),
    isTwoFactorEnabled: z.optional(z.boolean()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) return false;

      return true;
    },
    { message: "Nouveau mot de passe requis!", path: ["newPassword"] }
  )
  .refine(
    (data) => {
      if (!data.password && data.newPassword) return false;

      return true;
    },
    { message: "Mot de passe requis!", path: ["password"] }
  );

export type registerUserFormType = z.infer<typeof registerUserFormSchema>;
export type registerStudentFormType = z.infer<typeof registerStudentFormSchema>;
export type loginUserFormType = z.infer<typeof loginUserFormSchema>;
export type loginStudentFormType = z.infer<typeof loginStudentFormSchema>;
