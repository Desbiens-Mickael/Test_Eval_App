import PageTitle from "@/components/page-title";
import { ExerciceType } from "@/type/exercice";
import { Metadata } from "next";
import ExercicesTable from "../(components)/exercices-table";

export const metadata: Metadata = {
  title: "Exercices à choix multiple",
};

export default function MultipleChoiceGamePage() {
  return (
    <>
      <PageTitle title="Exercices à choix multiple" />
      <ExercicesTable exerciceType={ExerciceType.MultipleChoice} />
    </>
  );
}
