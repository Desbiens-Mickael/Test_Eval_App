import { Metadata } from "next";
import ShowCorrection from "../(components)/show-correction";

export const metadata: Metadata = {
  title: "Correction",
};

export default async function CorrectionExercicePage({
  params,
}: {
  params: Promise<{ studentExerciceId: string }>;
}) {
  const { studentExerciceId } = await params;

  return <ShowCorrection studentExerciceId={studentExerciceId} />;
}
