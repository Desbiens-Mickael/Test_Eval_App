import { z } from "zod";

export const createLessonSchema = z
    .object({
        title: z.string().min(1, { message: "Titre requis!" }),
        content: z.string().min(1, { message: "Contenu requis!" }),
        LessonSubjectID: z.string().min(1, { message: "Sujet requis!" }),
        GradeLevelsID: z.string().min(1, { message: "niveau requis!" }),
    })
    .required();