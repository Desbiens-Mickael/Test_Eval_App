import PageTitle from "@/components/page-title";
import { ExerciceType } from "@/type/exercice";
import { Metadata } from "next";
import ExercicesTable from "../(components)/exercices-table";

export const metadata: Metadata = {
  title: "Exercices à trou",
};

export default function HoleGamePage() {
  return (
    <>
      <PageTitle title="Exercices à trou" />
      <ExercicesTable exerciceType={ExerciceType.Fill_blank} />
    </>
  );
}
