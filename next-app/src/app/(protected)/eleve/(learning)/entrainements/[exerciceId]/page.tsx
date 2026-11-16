import { Metadata } from "next";
import PracticePlayer from "../(components)/practice-player";

export const metadata: Metadata = {
  title: "Entraînement",
};

export default async function PracticeExercisePage({
  params,
}: {
  params: Promise<{ exerciceId: string }>;
}) {
  const { exerciceId } = await params;

  return <PracticePlayer exerciceId={exerciceId} />;
}
