import { JSONContent } from "novel";
import { z } from "zod";

// Schéma de base pour la création des leçons
const createLessonBaseSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  imageBanner: z.string().optional(),
  LessonSubjectID: z.string().min(1, "Le sujet est requis"),
  GradeLevelsID: z.string().min(1, "Le niveau est requis"),
});

// Schéma pour la validation du formulaire côté client
export const createLessonFormSchema = createLessonBaseSchema
  .extend({
    content: z.custom<JSONContent>().refine((content) => {
      return content && Object.keys(content).length > 0;
    }, "Le contenu de la leçon est requis"),
  })
  .required();

// Schéma pour la validation de l'action serveur
export const createLessonSchema = createLessonBaseSchema
  .extend({
    content: z.string(),
  })
  .required();

// Types dérivés des schémas
export type CreateLessonFormInput = z.infer<typeof createLessonFormSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
