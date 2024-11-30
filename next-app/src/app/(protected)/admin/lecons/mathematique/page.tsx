import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import LessonTable from "../(components)/lesson-table";

export const metadata: Metadata = {
  title: "Leçon de mathématique",
};

export default function MathematicsPage() {
  return (
    <>
      <PageTitle title="Leçon de mathématique" />
      <LessonTable subject="Mathématique" />
    </>
  );
}
