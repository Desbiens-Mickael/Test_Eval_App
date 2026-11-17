import { prisma } from "@/lib/db";
import { globalExerciceCorectionType } from "@/shema-zod/exercice-corection.shema";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { facetCounts, filterValues, orderByFrom, paginate } from "@/lib/pagination";
import { PageQuery } from "@/type/pagination";
import { Exercice, ExerciceKind, ExerciceType, Prisma } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export type ExerciceOutput = {
  id: string;
  authorId?: string;
  title: string;
  kind: ExerciceKind;
  description: string;
  content: JsonValue;
  opensAt?: Date | null;
  closesAt?: Date | null;
  closedAt?: Date | null;
  lesson: {
    id: string;
    title: string;
    LessonSubject: {
      label: string;
      color: string;
    };
  };
  level: {
    id: string;
    label: string;
    color: string;
  };
  type: {
    id: string;
    name: string;
  };
  groups?: {
    id: string;
  }[];
};

/**
 * Création d'un exercice
 *
 * @param {createExerciceFormInput} data - Les données de l'exercice à créer.
 * @param {string} authorId - L'identifiant de l'auteur de l'exercice.
 * @param {string} lessonID - L'identifiant de la leçon associée à l'exercice.
 * @returns {Promise<Exercice>} - Une promesse qui résout à l'exercice créé.
 *
 * @example
 * // Créer un exercice
 * const newExercise = await createExercice({ title: "New title" }, "1", "1");
 *
 * @description
 * La fonction crée un nouvel exercice avec les données données. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const createExerciceData = async (
  data: createExerciceFormInput,
  authorId: string,
  lessonID: string
): Promise<Exercice> => {
  return await prisma.exercice.create({
    data: {
      title: data.title,
      description: data.description,
      kind: data.kind,
      // Un exercice (non noté) n'a pas de période de validité
      opensAt: data.kind === "CONTROL" ? data.opensAt : null,
      closesAt: data.kind === "CONTROL" ? data.closesAt : null,
      content: data.content,
      authorId: authorId,
      levelID: data.exerciceLevelId,
      typeID: data.exerciceTypeId,
      lessonID: lessonID,
    },
  });
};

/**
 * Mise à jour d'un exercice
 *
 * @param {string} id - L'identifiant de l'exercice à mettre à jour.
 * @param {string} authorId - L'identifiant de l'auteur de l'exercice.
 * @param {createExerciceFormInput} data - Les données de l'exercice à mettre à jour.
 * @returns {Promise<Exercice>} - Une promesse qui résout à l'exercice mis à jour.
 *
 * @example
 * // Mettre à jour l'exercice avec l'identifiant "1"
 * const updatedExercise = await updateExercice("1", "1", { title: "New title" });
 *
 * @description
 * La fonction met à jour l'exercice correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const updateExerciceData = async (
  id: string,
  authorId: string,
  data: createExerciceFormInput
): Promise<Exercice> => {
  return await prisma.exercice.update({
    where: { id: id, authorId: authorId },
    data: {
      title: data.title,
      description: data.description,
      kind: data.kind,
      // Un exercice (non noté) n'a pas de période de validité
      opensAt: data.kind === "CONTROL" ? data.opensAt : null,
      closesAt: data.kind === "CONTROL" ? data.closesAt : null,
      content: data.content,
      authorId: authorId,
      levelID: data.exerciceLevelId,
      typeID: data.exerciceTypeId,
    },
  });
};

/**
 * Delete multiple exercices
 *
 * @param {string[]} exerciceIds - Les identifiants des exercices à supprimer.
 * @param {string} authorId - L'identifiant de l'auteur de l'exercice.
 * @returns {Promise<{ count: number }>} - Une promesse qui résout à l'objet contenant le nombre de lignes supprimées.
 *
 * @example
 * // Supprimer les exercices avec les identifiants "1", "2" et "3"
 * const result = await deleteExercices(["1", "2", "3"]);
 *
 * @description
 * La fonction supprime les exercices correspondant aux identifiants donnés. La fonction retourne l'objet contenant le nombre de lignes supprimées.
 */
export const deleteExercicesData = async (
  exerciceIds: string[],
  authorId: string
) => {
  return await prisma.exercice.deleteMany({
    where: {
      authorId,
      id: {
        in: exerciceIds,
      },
    },
  });
};

/**
 * Ajoute un exercice à un groupe
 *
 * @param {string} exerciceId - L'identifiant de l'exercice à ajouter.
 * @param {string} groupId - L'identifiant du groupe à ajouter.
 * @returns {Promise<Exercice>} - Une promesse qui résout à l'exercice ajouté.
 *
 * @example
 * // Ajouter l'exercice avec l'identifiant "1" au groupe avec l'identifiant "2"
 * const addedExercise = await addExerciceToGroup("1", "2");
 *
 * @description
 * La fonction ajoute l'exercice correspondant à l'identifiant donné au groupe correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const addExerciceToGroupData = async (
  exerciceId: string,
  groupId: string
) => {
  return await prisma.exercice.update({
    where: { id: exerciceId },
    data: { groups: { connect: { id: groupId } } },
  });
};

/**
 * Supprime un exercice d'un groupe
 *
 * @param {string} exerciceId - L'identifiant de l'exercice à supprimer.
 * @param {string} groupId - L'identifiant du groupe à supprimer.
 * @returns {Promise<Exercice>} - Une promesse qui résout à l'exercice supprimé.
 *
 * @example
 * // Supprimer l'exercice avec l'identifiant "1" du groupe avec l'identifiant "2"
 * const removedExercise = await removeExerciceFromGroup("1", "2");
 *
 * @description
 * La fonction supprime l'exercice correspondant à l'identifiant donné du groupe correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const removeExerciceFromGroupData = async (
  exerciceId: string,
  groupId: string
) => {
  return await prisma.exercice.update({
    where: { id: exerciceId },
    data: { groups: { disconnect: { id: groupId } } },
  });
};

/**
 * Ajoute le résultat d'un exercice pour un élève ainsi que sa note
 *
 * @param {string} exerciceId - L'identifiant de l'exercice.
 * @param {string} studentId - L'identifiant de l'élève.
 * @param {string} subject - Le sujet de l'exercice.
 * @param {string} response - La réponse de l'élève.
 * @param {number} note - La note de l'élève.
 * @param {number} coeficient - Le coeficient de l'exercice.
 * @returns {Promise<StudentExercice>} - Une promesse qui résout à l'exercice ajouté.
 *
 * @example
 * // Ajouter le résultat de l'exercice avec l'identifiant "1" pour l'élève avec l'identifiant "2"
 * const addedExerciseResult = await addExerciceResult("1", "2", "Mathématiques", "1", "2", "3", "4");
 *
 * @description
 * La fonction ajoute le résultat de l'exercice correspondant à l'identifiant donné pour l'élève correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const addExerciceResultData = async (
  studentId: string,
  subject: string,
  data: globalExerciceCorectionType,
  result: { note: number; coeficient: number }
) => {
  return await prisma.studentExercice.create({
    data: {
      studentId,
      exerciceId: data.exerciceId,
      subject,
      response: data.response,
      note: result.note,
      autoNote: result.note,
      coeficient: result.coeficient,
    },
  });
};

/**
 * Enregistre la relecture d'une copie par le professeur.
 * `autoNote` garde la note calculée automatiquement à l'origine.
 */
export const updateStudentExerciceReviewData = async (
  studentExerciceId: string,
  data: {
    note: number;
    autoNote: number;
    teacherComment: string | null;
  }
) => {
  return await prisma.studentExercice.update({
    where: { id: studentExerciceId },
    data: { ...data, reviewedAt: new Date() },
  });
};

/**
 * Get exercices info before delete
 *
 * @param {string[]} exerciceIds - Les identifiants des exercices à supprimer.
 * @returns {Promise<ExerciceOutput[]>} - Une promesse qui résout à une liste d'exercices.
 *
 * @example
 * // Récupérer les exercices avec les identifiants "1", "2" et "3"
 * const exercises = await getExercicesInfoBeforeDelete(["1", "2", "3"]);
 *
 * @description
 * La fonction récupère une liste d'exercices filtrée par les identifiants donnés. Les champs retournés pour chaque exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `type.name`: Le type de l'exercice
 */
export const getExercicesInfoBeforeDelete = async (exerciceIds: string[]) => {
  return await prisma.exercice.findMany({
    where: {
      id: {
        in: exerciceIds,
      },
    },
    select: {
      id: true,
      type: {
        select: { name: true },
      },
    },
  });
};

/**
 * Get all exercice
 * @returns exercice list
 */
export const getAllExercicesData = async (): Promise<ExerciceOutput[]> => {
  try {
    return await prisma.exercice.findMany({
      select: {
        id: true,
        title: true,
        kind: true,
        opensAt: true,
        closesAt: true,
        closedAt: true,
        description: true,
        content: true,
        lesson: {
          select: {
            id: true,
            title: true,
            LessonSubject: {
              select: { label: true, color: true },
            },
          },
        },
        level: {
          select: {
            id: true,
            label: true,
            color: true,
          },
        },
        type: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw new Error("Échec de la récupération des exercices");
  }
};

// Colonnes triables du tableau des exercices
const exerciceSortColumns: Record<string, (d: Prisma.SortOrder) => Prisma.ExerciceOrderByWithRelationInput> = {
  Titre: (d) => ({ title: d }),
  Niveau: (d) => ({ level: { label: d } }),
  Leçon: (d) => ({ lesson: { title: d } }),
  Matière: (d) => ({ lesson: { LessonSubject: { label: d } } }),
};

/**
 * Une page des exercices (ou contrôles) d'un professeur pour un type donné.
 * Ne charge que les colonnes du tableau : ni contenu ni solutions.
 * Filtres : recherche sur le titre, niveaux (« Niveau ») et matières (« Matière »).
 * Les compteurs de chaque filtre tiennent compte des autres filtres.
 */
export const getExercicesPageData = async (
  authorId: string,
  type: ExerciceType,
  kind: ExerciceKind,
  query: PageQuery
) => {
  const levels = filterValues(query, "Niveau");
  const subjects = filterValues(query, "Matière");
  const base: Prisma.ExerciceWhereInput = {
    authorId,
    typeID: type.id,
    kind,
    ...(query.search && { title: { contains: query.search, mode: "insensitive" } }),
  };
  const byLevel = (labels?: string[]): Prisma.ExerciceWhereInput =>
    labels ? { level: { label: { in: labels } } } : {};
  const bySubject = (labels?: string[]): Prisma.ExerciceWhereInput =>
    labels ? { lesson: { LessonSubject: { label: { in: labels } } } } : {};
  const where = { AND: [base, byLevel(levels), bySubject(subjects)] };

  const [page, allLevels, allSubjects] = await Promise.all([
    paginate(
      query,
      () => prisma.exercice.count({ where }),
      ({ skip, take }) =>
        prisma.exercice.findMany({
          where,
          orderBy: orderByFrom(query.sort, exerciceSortColumns, { createdAt: "desc" }),
          skip,
          take,
          select: {
            id: true,
            title: true,
            kind: true,
            opensAt: true,
            closesAt: true,
            lesson: { select: { title: true, LessonSubject: { select: { label: true, color: true } } } },
            level: { select: { label: true, color: true } },
          },
        })
    ),
    prisma.exerciceLevel.findMany({ select: { label: true } }),
    prisma.lessonSubject.findMany({ select: { label: true } }),
  ]);

  const [levelFacets, subjectFacets] = await Promise.all([
    facetCounts(
      allLevels.map((l) => l.label),
      (label) => prisma.exercice.count({ where: { AND: [base, byLevel([label]), bySubject(subjects)] } })
    ),
    facetCounts(
      allSubjects.map((s) => s.label),
      (label) => prisma.exercice.count({ where: { AND: [base, byLevel(levels), bySubject([label])] } })
    ),
  ]);

  return {
    ...page,
    items: page.items.map((exercice) => ({
      id: exercice.id,
      title: exercice.title,
      kind: exercice.kind,
      opensAt: exercice.opensAt,
      closesAt: exercice.closesAt,
      lesson: exercice.lesson.title,
      level: exercice.level.label,
      levelColor: exercice.level.color,
      subject: exercice.lesson.LessonSubject.label,
      subjectColor: exercice.lesson.LessonSubject.color,
    })),
    facets: { Niveau: levelFacets, Matière: subjectFacets },
  };
};

/**
 * Récupère un exercice par son identifiant
 *
 * @param {string} id - L'identifiant de l'exercice à récupérer.
 * @returns {Promise<ExerciceOutput | null>} - Une promesse qui résout à l'exercice correspondant à l'identifiant donné, ou null si l'exercice n'existe pas.
 *
 * @example
 * // Récupérer l'exercice avec l'identifiant "1"
 * const exercise = await getExerciceById("1");
 *
 * @description
 * La fonction récupère l'exercice correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const getExerciceByIdData = async (
  id: string
): Promise<ExerciceOutput | null> => {
  return await prisma.exercice.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      kind: true,
      opensAt: true,
      closesAt: true,
      closedAt: true,
      description: true,
      content: true,
      authorId: true,
      lesson: {
        select: {
          id: true,
          title: true,
          LessonSubject: {
            select: { label: true, color: true },
          },
        },
      },
      level: {
        select: {
          id: true,
          label: true,
          color: true,
        },
      },
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      groups: {
        select: {
          id: true,
        },
      },
    },
  });
};

/**
 * Récupère les auteurs des exercices
 *
 * @param {string[]} exerciceIds - Les identifiants des exercices à récupérer.
 * @returns {Promise<{ id: string; authorId: string }[]>} - Une promesse qui résout à une liste d'objets contenant l'ID de l'exercice et l'ID de l'auteur.
 *
 * @example
 * // Récupérer les auteurs des exercices avec les identifiants "1", "2" et "3"
 * const authors = await getExercicesWithAuthor(["1", "2", "3"]);
 *
 * @description
 * La fonction récupère une liste d'objets contenant l'ID de l'exercice et l'ID de l'auteur. Les champs retournés pour chaque exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `authorId`: L'identifiant unique de l'auteur de l'exercice
 */
export const getExercicesWithAuthor = async (exerciceIds: string[]) => {
  return await prisma.exercice.findMany({
    where: {
      id: {
        in: exerciceIds,
      },
    },
    select: {
      id: true,
      authorId: true,
    },
  });
};

/**
 * Récupère tous les exercices d'une leçon
 *
 * @param {string} lessonId - L'identifiant de la leçon.
 * @returns {Promise<ExerciceOutput[]>} - Une promesse qui résout à une liste d'exercices.
 *
 * @example
 * // Récupérer tous les exercices d'une leçon avec l'identifiant "1"
 * const exercises = await getAllExercicesByLessonId("1");
 *
 * @description
 * La fonction récupère une liste d'exercices filtrée par la leçon donnée. Les champs retournés pour chaque exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `level.label`: Le niveau de difficulté de l'exercice
 * - `type.name`: Le type de l'exercice
 */
export const getAllExercicesByLessonIdData = async (lessonId: string) => {
  return await prisma.exercice.findMany({
    where: {
      lessonID: lessonId,
    },
    select: {
      id: true,
      title: true,
      kind: true,
      opensAt: true,
      closesAt: true,
      closedAt: true,
      description: true,
      level: {
        select: {
          id: true,
          label: true,
          color: true,
        },
      },
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      groups: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });
};

/**
 * Récupère tous les exercices d'un élève
 *
 * @param {string} studentId - L'identifiant de l'élève.
 * @returns {Promise<StudentExercice[]>} - Une promesse qui résout à une liste d'exercices.
 *
 * @example
 * // Récupérer tous les exercices d'un élève avec l'identifiant "1"
 * const exercises = await getStudentExerciceByStudentId("1");
 *
 * @description
 * La fonction récupère une liste d'exercices filtrée par l'élève donné. Les champs retournés pour chaque exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `level.label`: Le niveau de difficulté de l'exercice
 * - `type.name`: Le type de l'exercice
 */
export const getStudentExerciceByStudentIdData = async (
  studentId: string,
  subject?: string
) => {
  return await prisma.studentExercice.findMany({
    where: {
      studentId: studentId,
      subject: subject,
    },
    include: {
      exercice: {
        select: {
          id: true,
          title: true,
          closesAt: true,
          lesson: {
            select: {
              LessonSubject: {
                select: { label: true, color: true },
              },
            },
          },
          level: {
            select: {
              label: true,
              color: true,
            },
          },
          type: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

/**
 * Une page des copies d'un élève, de la plus récente à la plus ancienne,
 * éventuellement limitée à une matière.
 */
export const getStudentExercicesPageData = async (
  studentId: string,
  subject: string | undefined,
  query: Pick<PageQuery, "page" | "pageSize">
) => {
  const where: Prisma.StudentExerciceWhereInput = { studentId, subject };
  return paginate(
    query,
    () => prisma.studentExercice.count({ where }),
    ({ skip, take }) =>
      prisma.studentExercice.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        skip,
        take,
        include: {
          exercice: {
            select: {
              id: true,
              title: true,
              closesAt: true,
              lesson: { select: { LessonSubject: { select: { label: true, color: true } } } },
            },
          },
        },
      })
  );
};

/**
 * Récupère tous les exercices d'un groupe en fonction du sujet
 *
 * @param {string} groupId - L'identifiant du groupe.
 * @param {string} subject - Le sujet de l'exercice.
 *
 * @example
 * // Récupérer tous les exercices d'un groupe avec l'identifiant "1"
 * const exercises = await getExercisesByGroupIdAndSubjectData("1", "Français");
 *
 * @description
 * La fonction récupère une liste d'exercices filtrée par le groupe et le sujet donné. Les champs retournés pour chaque exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `level.label`: Le niveau de difficulté de l'exercice
 * - `type.name`: Le type de l'exercice
 */
export const getExercisesByGroupIdAndSubjectData = async (
  groupId: string,
  subject?: string
) => {
  return await prisma.exercice.findMany({
    where: {
      // Les entraînements ont leur propre page
      kind: "CONTROL",
      groups: {
        some: {
          id: groupId,
        },
      },
      lesson: {
        LessonSubject: {
          label: subject,
        },
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      opensAt: true,
      closesAt: true,
      lesson: {
        select: {
          id: true,
          LessonSubject: true,
        },
      },
      level: true,
      type: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getStudentExerciceByIdData = async (studentExerciceId: string) => {
  return await prisma.studentExercice.findUnique({
    where: {
      id: studentExerciceId,
    },
    include: {
      exercice: {
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          closesAt: true,
          lessonID: true,
          type: {
            select: {
              name: true,
            },
          },
        },
      },
      student: {
        select: {
          id: true,
          name: true,
          professorId: true,
        },
      },
    },
  });
};

