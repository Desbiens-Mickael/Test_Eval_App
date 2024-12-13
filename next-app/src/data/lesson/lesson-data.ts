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
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw new Error("Échec de la récupération des leçons");
  }
};

// Récupèration de toutes les leçons selon leur sujet
export const getAllLessonBySubjectData = async (
  subject: string,
  authorId: string
): Promise<LessonOutput[]> => {
  return prisma.lesson.findMany({
    where: {
      authorId: authorId,
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
    },
    orderBy: { createdAt: "desc" },
  });
};

// Récupération de la leçon par son ID
export const getLessonByIdData = async (id: string, authorId: string) => {
  return await prisma.lesson.findUnique({ where: { id, authorId } });
};

// Récupération de la leçon par son slug
export const getLessonBySlugData = async (slug: string, authorId: string) => {
  return await prisma.lesson.findUnique({
    where: { slug_authorId: { slug, authorId } },
  });
};

export const getLessonsWithAuthor = async (lessonIds: string[]) => {
  return await prisma.lesson.findMany({
    where: {
      id: {
        in: lessonIds,
      },
    },
    select: {
      id: true,
      authorId: true,
    },
  });
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
    },
    select: {
      LessonSubject: {
        select: { label: true },
      },
    },
  });
};

// Mise à jour de la leçon
export const updateLessonData = async (
  authorId: string,
  LessonId: string,
  data: CreateLessonType
) => {
  return await prisma.lesson.update({
    where: { id: LessonId, authorId },
    data: { ...data },
    select: {
      slug: true,
      LessonSubject: {
        select: { label: true },
      },
    },
  });
};

// Suppression de la leçon
export const deleteLessonsData = async (
  lessonIds: string[],
  authorId: string
) => {
  return await prisma.lesson.deleteMany({
    where: {
      authorId,
      id: {
        in: lessonIds,
      },
    },
  });
};

export const getLessonsInfoBeforeDelete = async (lessonIds: string[]) => {
  return await prisma.lesson.findMany({
    where: {
      id: {
        in: lessonIds,
      },
    },
    select: {
      slug: true,
      LessonSubject: {
        select: { label: true },
      },
    },
  });
};
