import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Création d'un exercice",
};

export default function ExerciceCreate() {
  return (
    <>
      <PageTitle title="Création d'un exercice" />
    </>
  );
}
