import PageTitle from "@/components/page-title";
import ExercicesTable from "@/components/table/exercice-table/exercices-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercices à liste",
};

export default function ListGamePage() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <PageTitle title="Exercices à liste" />
      <ExercicesTable exerciceType="List" />
    </div>
  );
}