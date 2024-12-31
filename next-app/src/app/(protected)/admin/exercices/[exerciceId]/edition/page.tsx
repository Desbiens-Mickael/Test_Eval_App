import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditExercice from "../../(components)/edit-exercice";

export const metadata: Metadata = {
  title: "Edition de l'exercice",
};

export default async function EditeExercicePage({
  params,
}: {
  params: Promise<{ exerciceId: string }>;
}) {
  const exerciceId = (await params).exerciceId;

  if (!exerciceId) {
    notFound();
  }

  return (
    <>
      <PageTitle title="Edition de l'exercice" />
      <EditExercice exerciceId={exerciceId} />
    </>
  );
}
