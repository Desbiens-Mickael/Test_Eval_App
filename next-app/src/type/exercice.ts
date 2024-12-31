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
};

export enum ExerciceType {
  Card = "Carte",
  True_or_False = "Vrai ou Faux",
  MultipleChoice = "Choix multiple",
  Fill_blank = "Texte à trou",
}
