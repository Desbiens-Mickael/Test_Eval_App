import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import LessonDashboard from "./(components)/lesson-dashboard";

export const metadata: Metadata = {
  title: "Mes leçons",
};

export default function LessonsPage() {
  return (
    <>
      <PageTitle title="Mes leçons" />
      <LessonDashboard />
    </>
  );
}
