import { JsonValue } from "@prisma/client/runtime/library";

export type Exercice = {
  id: string;
  lesson: string;
  title: string;
  /** CONTROL : noté, une tentative. PRACTICE : entraînement non noté */
  kind: "CONTROL" | "PRACTICE";
  description: string;
  content: JsonValue;
  /** Période de validité d'un contrôle (null = pas de limite) */
  opensAt?: Date | null;
  closesAt?: Date | null;
  /** Exercice "Carte" vu par un élève : cartes mélangées, sans leur colonne */
  cards?: { id: string; content: string }[];
  levelId: string;
  level: string;
  levelColor: string;
  subject: string;
  subjectColor: string;
  typeId: string;
  type: string;
  groups?: { id: string }[];
};

export enum ExerciceType {
  Card = "Carte",
  True_or_False = "Vrai ou Faux",
  MultipleChoice = "Choix multiple",
  Fill_blank = "Texte à trou",
}

export type StudentExerciceCard = {
  exerciceId?: string;
  title?: string;
  lessonSubject?: string;
  lessonSubjectColor?: string;
  studentExerciceId: string;
  /** null tant que la note est cachée à l'élève (contrôle pas encore clos) */
  note: number | null;
  coeficient: number;
  createdAt: Date;
  /** Copie non rendue à la clôture : notée 0 */
  isMissing: boolean;
  /** Date à laquelle la note et la correction seront visibles, si elles ne le sont pas encore */
  resultsAvailableAt: Date | null;
};

export type StudentExerciceById = {
  id: string;
  studentId: string;
  note: number;
  autoNote: number | null;
  teacherComment: string | null;
  reviewedAt: Date | null;
  isMissing: boolean;
  createdAt: Date;
  response: JsonValue;
  coeficient: number;
  exercice: {
    id: string;
    title: string;
    description: string;
    content: JsonValue;
    closesAt: Date | null;
    type: {
      name: string;
    };
  } | null;
  student: {
    id: string;
    name: string;
    professorId: string;
  };
} | null;

export type noteExerciceStudent = {
  note: number;
  coeficient: number;
};

export type baseResponseExercice = {
  exerciceId: string;
  level: string;
};
