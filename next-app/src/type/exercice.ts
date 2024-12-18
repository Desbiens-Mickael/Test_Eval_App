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
  Card = "Carte",
  True_or_False = "Vrai ou Faux",
  MultipleChoice = "Choix multiple",
  Fill_blank = "Texte à trou",
}
