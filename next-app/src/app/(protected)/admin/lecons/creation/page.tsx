import LessonForm from "@/app/(protected)/admin/lecons/(components)/form/lesson-form";
import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Création d'une leçon",
};

export default function CreateLecon() {
  return (
    <>
      <PageTitle title="Création d'une leçon" />
      <LessonForm />
    </>
  );
}
