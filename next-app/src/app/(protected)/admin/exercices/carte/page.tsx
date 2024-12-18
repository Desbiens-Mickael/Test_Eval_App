import PageTitle from "@/components/page-title";
import { ExerciceType } from "@/type/exercice";
import { Metadata } from "next";
import ExercicesTable from "../(components)/exercices-table";

export const metadata: Metadata = {
  title: "Exercices de cartes",
};

export default function CardGamePage() {
  return (
    <>
      <PageTitle title="Exercices de cartes" />
      <ExercicesTable exerciceType={ExerciceType.Card} />
    </>
  );
}
