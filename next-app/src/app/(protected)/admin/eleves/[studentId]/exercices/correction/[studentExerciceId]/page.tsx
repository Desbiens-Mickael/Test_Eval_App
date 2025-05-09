import ShowCorrection from "@/app/(protected)/eleve/exercices/correction/(components)/show-correction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Correction",
};

export default async function ShowCorrectionPage({
  params,
}: {
  params: Promise<{ studentExerciceId: string }>;
}) {
  const { studentExerciceId } = await params;

  return <ShowCorrection studentExerciceId={studentExerciceId} />;
}
