"use server"

import { createLesson } from "@/data/lesson/lesson-data";
import { currentUser } from "@/lib/auth";
import { createLessonSchema } from "@/shema-zod/lesson";
import { z } from "zod";

const createNewLesson = async (data: z.infer<typeof createLessonSchema>) => {
    const user = await currentUser();
    if (!user || !user.id) return { error: "Action non autoriser!" };

    const isDataValide = createLessonSchema.safeParse(data);
    if (!isDataValide.success) return { error: "Données non valide!" };
    
    await createLesson(data, user.id);

    return { success: "La leçon a été créée avec succès." };
}

export default createNewLesson