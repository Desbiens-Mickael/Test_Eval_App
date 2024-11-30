export type Exercice = {
  id: string;
  lesson: string;
  title: string;
  level: string;
  subject: string;
  levelColor: string;
  subjectColor: string;
};

export enum ExerciceType {
  Card = "Card",
  True_or_False = "True_or_False",
  List = "List",
  Fill_blank = "Fill_blank",
}
