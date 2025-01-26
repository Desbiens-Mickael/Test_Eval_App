import z from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du groupe est requis")
    .max(20, "Le nom du groupe doit contenir au maximum de 20 caractères"),
});

export const addUserToGroupSchema = z.object({
  identifier: z.string().min(1, "Identifiant requis"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type AddUserToGroupInput = z.infer<typeof addUserToGroupSchema>;
