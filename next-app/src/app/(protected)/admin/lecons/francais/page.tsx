import PageTitle from "@/components/page-title";
import LessonTable from "@/components/table/lesson-table/lesson-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leçon de français",
};

export default function FrenshPage() {
  return (
    <div className="w-full h-full flex flex-col items-center max-w-[1200px]">
      <PageTitle title="Leçon de français" />
      <LessonTable subject="Français" />
    </div>
  );
}
