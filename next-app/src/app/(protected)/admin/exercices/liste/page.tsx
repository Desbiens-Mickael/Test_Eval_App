import PageTitle from "@/components/page-title";
import { ExerciceType } from "@/type/exercice";
import { Metadata } from "next";
import ExercicesTable from "../(components)/exercices-table";

export const metadata: Metadata = {
  title: "Exercices à liste",
};

export default function ListGamePage() {
  return (
    <>
      <PageTitle title="Exercices à liste" />
      <ExercicesTable exerciceType={ExerciceType.List} />
    </>
  );
}
