import { prisma } from "@/lib/db";
import { CreateLessonType } from "@/type/lesson";

export type LessonOutput = {
  id: string;
  title: string;
  slug: string;
  LessonSubject: {
    label: string;
    color: string;
  };
  GradeLevels: {
    label: string;
    color: string;
  };
};

// Récupération de toutes les leçons
export const getAllLessonData = async (): Promise<LessonOutput[]> => {
  try {
    return await prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        LessonSubject: {
          select: { label: true, color: true },
        },
        GradeLevels: {
          select: { label: true, color: true },
        },
      }, orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw new Error("Échec de la récupération des leçons");
  }
};


 // Récupèration de toutes les leçons selon leur sujet
export const getAllLessonBySubjectData = async (subject: string): Promise<LessonOutput[]> => {
  return prisma.lesson.findMany({
    where: {
      LessonSubject: {
        label: subject,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      LessonSubject: {
        select: { label: true, color: true },
      },
      GradeLevels: {
        select: { label: true, color: true },
      },
    }, orderBy: { createdAt: "desc" },
  });
};

// Récupération de la leçon par son ID
export const getLessonByIdData = async (id: string) => {
  return await prisma.lesson.findUnique({ where: { id } });
};

// Récupération de la leçon par son slug
export const getLessonBySlugData = async (slug: string, authorId: string) => {
  return await prisma.lesson.findUnique({ where: { slug_authorId: { slug, authorId } } });
};

// Création d'une nouvelle leçon
export const createLessonData = async (data: CreateLessonType) => {
  return await prisma.lesson.create({
    data: {
      title: data.title,
      content: data.content,
      slug: data.slug,
      authorId: data.authorId,
      LessonSubjectID: data.LessonSubjectID,
      GradeLevelsID: data.GradeLevelsID,
    },select: {
      LessonSubject: {
        select: { label: true },
      },
    },
  });
};

// Mise à jour de la leçon
export const updateLessonData = async (LessonId: string, data: CreateLessonType) => {
  return await prisma.lesson.update({ 
    where: { id: LessonId },
    data: { ...data }, 
    select: {
      slug: true,
      LessonSubject: {
        select: { label: true },
      },
    } 
  });
};

// Suppression de la leçon
export const deleteLessonByIdData = async (id: string) => {
  return await prisma.lesson.delete({ where: { id } });
};
