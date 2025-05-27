import { prisma } from "@/lib/db";
import { CreateLessonType } from "@/type/lesson";

export type LessonOutput = {
  id: string;
  title: string;
  imageBanner: string | null;
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
export const getAllLessonByAuthorIdData = async (
  authorId: string
): Promise<LessonOutput[]> => {
  try {
    return await prisma.lesson.findMany({
      where: {
        authorId: authorId,
      },
      select: {
        id: true,
        title: true,
        imageBanner: true,
        slug: true,
        LessonSubject: {
          select: { label: true, color: true },
        },
        GradeLevels: {
          select: { label: true, color: true },
        },
      },
      orderBy: { title: "asc" },
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
      imageBanner: true,
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

// Récupération d'une leçon par son ID pour un élève
export const getLessonByIdForStudentData = async (id: string) => {
  return await prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      imageBanner: true,
      slug: true,
      content: true,
      LessonSubject: {
        select: { id: true, label: true, color: true },
      },
      GradeLevels: {
        select: { id: true, label: true, color: true },
      },
    },
  });
};

// Récupération des leçons par leurs ID
export const getLessonsByIdsData = async (lessonIds: string[]) => {
  return await prisma.lesson.findMany({
    where: {
      id: {
        in: lessonIds,
      },
    },
  });
};

// Récupération de la leçon par son slug
export const getLessonBySlugData = async (slug: string, authorId: string) => {
  return await prisma.lesson.findUnique({
    where: { slug_authorId: { slug, authorId } },
  });
};

// Récupération des leçons avec l'auteur
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
      imageBanner: true,
    },
  });
};

// récupération de toutes les leçons d'un groupe
export const getAllLessonsByGroupIdData = async (
  groupId: string,
  subject?: string
) => {
  return await prisma.lesson.findMany({
    where: {
      LessonSubject: {
        label: subject,
      },
      groups: {
        some: {
          id: groupId,
        },
      },
    },
    include: {
      LessonSubject: {
        select: { label: true, color: true },
      },
      GradeLevels: {
        select: { label: true, color: true },
      },
    },
    orderBy: { title: "asc" },
  });
};

// Récupération de toutes les leçons non contenu dans le groupe donné
export const getAllLessonsNotInGroupData = async (groupId: string) => {
  return await prisma.lesson.findMany({
    where: {
      groups: {
        none: {
          id: groupId,
        },
      },
    },
    include: {
      LessonSubject: {
        select: { label: true, color: true },
      },
      GradeLevels: {
        select: { label: true, color: true },
      },
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
      imageBanner: true,
      LessonSubject: {
        select: { label: true },
      },
    },
  });
};
