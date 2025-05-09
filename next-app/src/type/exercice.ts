import { JsonValue } from "@prisma/client/runtime/library";

export type Exercice = {
  id: string;
  lesson: string;
  title: string;
  description: string;
  content: JsonValue;
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
  exerciceId?: string;
  studentId: string;
  note: number;
  createdAt: Date;
  response: string;
  coeficient: number;
  exercice?: {
    id: string;
    title: string;
    description: string;
    content: JsonValue;
    type: {
      name: string;
    };
  };
  student: {
    id: string;
    name: string;
  };
};
