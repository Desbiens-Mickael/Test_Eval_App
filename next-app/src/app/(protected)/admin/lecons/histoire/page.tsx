import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import LessonTable from "../(components)/lesson-table";

export const metadata: Metadata = {
  title: "Leçon d'histoire",
};

export default function HistoryPage() {
  return (
    <>
      <PageTitle title="Leçon d'histoire" />
      <LessonTable subject="Histoire" />
    </>
  );
}
