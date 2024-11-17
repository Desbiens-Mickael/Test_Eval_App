import { z } from "zod";

export const createLessonSchema = z
    .object({
        name: z.string().min(1, { message: "Titre requis!" }),
        content: z.string().min(1, { message: "Contenu requis!" }),
        authorId: z.string().min(1, { message: "Description requis!" }),
        LessonSubjectID: z.string().min(1, { message: "Sujet requis!" }),
        GradeLevelsID: z.string().min(1, { message: "Chapitre requis!" }),
    })
    .required();