import { getExerciceKindData } from "@/data/exercice/practice-data";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import ShowExercise from "../(components)/show-exercise";

export const metadata: Metadata = {
  title: "Exercice",
};

export default async function Exercice({
  params,
}: {
  params: Promise<{ exerciceId: string }>;
}) {
  const { exerciceId } = await params;

  // Un entraînement se joue depuis sa propre page (ex. lien d'une notification)
  if ((await getExerciceKindData(exerciceId)) === "PRACTICE") {
    redirect(`/eleve/entrainements/${exerciceId}`);
  }

  return <ShowExercise exerciceId={exerciceId} />;
}
