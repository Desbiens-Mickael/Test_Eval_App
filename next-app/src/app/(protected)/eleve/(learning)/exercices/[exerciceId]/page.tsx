import { Metadata } from "next";
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

  return <ShowExercise exerciceId={exerciceId} />;
}
