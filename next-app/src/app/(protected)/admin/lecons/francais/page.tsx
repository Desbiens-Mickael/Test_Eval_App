import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import LessonTable from "../(components)/lesson-table";

export const metadata: Metadata = {
  title: "Leçon de français",
};

export default function FrenshPage() {
  return (
    <>
      <PageTitle title="Leçon de français" />
      <LessonTable subject="Français" />
    </>
  );
}
