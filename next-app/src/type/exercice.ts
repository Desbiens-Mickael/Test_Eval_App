import { JsonValue } from "@prisma/client/runtime/library";

export type Exercice = {
  id: string;
  lesson: string;
  title: string;
  description: string;
  content: JsonValue;
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
  note: number;
  coeficient: number;
  createdAt: Date;
};

export type StudentExerciceById = {
  id: string;
  studentId: string;
  note: number;
  createdAt: Date;
  response: JsonValue;
  coeficient: number;
  exercice: {
    id: string;
    title: string;
    description: string;
    content: JsonValue;
    type: {
      name: string;
    };
  } | null;
  student: {
    id: string;
    name: string;
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
