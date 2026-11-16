import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import ExerciceForm from "../../(components)/form/exercice-form";

export const metadata: Metadata = {
  title: "Modifier un exercice ou un contrôle",
};

export default function ExerciceEdit() {
  return (
    <>
      <PageTitle title="Modifier un exercice ou un contrôle" />
      <ExerciceForm />
    </>
  );
}
