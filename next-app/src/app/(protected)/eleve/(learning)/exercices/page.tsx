import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import ExerciseDashboard from "./(components)/exercise-dashboard";

export const metadata: Metadata = {
  title: "Mes exercices",
};

export default function ExercisesPage() {
  return (
    <>
      <PageTitle title="Mes exercices" />
      <ExerciseDashboard />
    </>
  );
}
