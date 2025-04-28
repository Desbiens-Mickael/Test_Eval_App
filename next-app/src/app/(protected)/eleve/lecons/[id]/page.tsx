import ShowLesson from "@/app/(protected)/eleve/lecons/components/show-lesson";
import PageTitle from "@/components/page-title";

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
