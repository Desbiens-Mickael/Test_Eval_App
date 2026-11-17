import { z } from "zod";

export const MAX_PAGE_SIZE = 50;

/** Valide les paramètres de pagination reçus par une action serveur */
export const pageQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(MAX_PAGE_SIZE).default(10),
  search: z
    .string()
    .trim()
    .max(100)
    .optional()
    .transform((value) => value || undefined),
  sort: z.object({ id: z.string().max(50), desc: z.boolean() }).optional(),
  filters: z.record(z.string().max(50), z.array(z.string().max(100)).max(50)).optional(),
});

export type PageQueryInput = z.input<typeof pageQuerySchema>;
