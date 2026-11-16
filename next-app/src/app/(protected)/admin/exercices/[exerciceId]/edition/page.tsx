import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditExercice from "../../(components)/edit-exercice";

export const metadata: Metadata = {
  title: "Modifier un exercice ou un contrôle",
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
    <EditExercice exerciceId={exerciceId} />
  );
}
