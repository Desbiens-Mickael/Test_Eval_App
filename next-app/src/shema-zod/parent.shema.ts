import { z } from "zod";

/**
 * E-mail du parent sur la fiche élève : facultatif.
 * Vide (ou que des espaces) → null : aucun accès parent.
 * Renseigné → adresse normalisée en minuscules.
 */
export const parentEmailShema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value ?? null),
  z
    .string()
    .trim()
    .toLowerCase()
    .email("Adresse e-mail du parent invalide")
    .max(254, "Adresse e-mail trop longue")
    .nullable()
);

export const studentParentEmailFormSchema = z.object({
  parentEmail: z.string().trim().optional(),
});

export type StudentParentEmailFormType = z.infer<typeof studentParentEmailFormSchema>;

/** Changement du mot de passe (provisoire) d'un parent */
export const parentPasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Saisissez votre mot de passe actuel"),
    newPassword: z.string().min(8, "Au moins 8 caractères").max(100, "100 caractères au plus"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les deux mots de passe ne sont pas identiques",
    path: ["confirmPassword"],
  });

export type ParentPasswordFormType = z.infer<typeof parentPasswordFormSchema>;
