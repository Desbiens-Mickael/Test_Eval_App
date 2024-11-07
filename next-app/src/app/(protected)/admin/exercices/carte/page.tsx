import PageTitle from "@/components/page-title";
import ExercicesTable from "@/components/table/exercice-table/exercices-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercices de cartes",
};

export default function CardGamePage() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <PageTitle title="Exercices de cartes" />
      <ExercicesTable exerciceType="Card" />
    </div>
  );
}
