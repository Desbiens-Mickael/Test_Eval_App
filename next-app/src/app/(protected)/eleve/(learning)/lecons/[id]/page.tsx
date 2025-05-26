import ShowLesson from "@/app/(protected)/eleve/(learning)/lecons/(components)/show-lesson";
import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leçon",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <PageTitle title="Leçon" />
      <ShowLesson id={id} />
    </>
  );
}
