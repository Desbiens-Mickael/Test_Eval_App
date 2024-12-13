import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import ExerciceForm from "../../(components)/form/exercice-form";

export const metadata: Metadata = {
  title: "Edition d'un exercice",
};

export default function ExerciceEdit() {
  return (
    <>
      <PageTitle title="Edition d'un exercice" />
      <ExerciceForm />
    </>
  );
}
