import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import ExerciceForm from "@/app/(protected)/admin/exercices/(components)/form/exercice-form";

export const metadata: Metadata = {
  title: "Création d'un exercice",
};
export default async function ExerciceCreate({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <>
      <PageTitle title="Création d'un exercice" />
      <ExerciceForm lessonSlug={slug} />
    </>
  );
}
