import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import LessonTable from "../(components)/lesson-table";

export const metadata: Metadata = {
  title: "Leçon de physique",
};

export default function PhysiquePage() {
  return (
    <>
      <PageTitle title="Leçon de physique" />
      <LessonTable subject="Physique" />
    </>
  );
}
