import z from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du groupe est requis")
    .max(20, "Le nom du groupe doit contenir au maximum de 20 caractères"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
