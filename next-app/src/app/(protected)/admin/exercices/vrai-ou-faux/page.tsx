import PageTitle from "@/components/page-title";
import { ExerciceType } from "@/type/exercice";
import { Metadata } from "next";
import ExercicesTable from "../(components)/exercices-table";

export const metadata: Metadata = {
  title: "Exercices Vrai / Faux",
};

export default function BooleanGamePage() {
  return (
    <>
      <PageTitle title="Exercices Vrai / Faux" />
      <ExercicesTable exerciceType={ExerciceType.True_or_False} />
    </>
  );
}
