import ShowCorrection from "@/app/(protected)/eleve/(learning)/exercices/correction/(components)/show-correction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copie corrigée",
};

/** Copie d'un enfant, vue par son parent (lecture seule) */
export default async function ParentCopyPage({
  params,
}: {
  params: Promise<{ studentId: string; studentExerciceId: string }>;
}) {
  const { studentId, studentExerciceId } = await params;
  return <ShowCorrection studentExerciceId={studentExerciceId} mode="parent" childId={studentId} />;
}
