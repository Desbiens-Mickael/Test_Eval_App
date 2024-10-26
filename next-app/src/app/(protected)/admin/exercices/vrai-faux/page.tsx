import PageTitle from "@/components/page-title";
import ExercicesTable from "@/components/table/exercice-table/exercices-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exercices Vrai / Faux",
};

export default function BooleanGamePage() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <PageTitle title="Exercices Vrai / Faux" />
      <ExercicesTable exerciceType="True_or_False" />
    </div>
  );
}
