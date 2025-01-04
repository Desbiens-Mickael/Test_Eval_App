import EditLesson from "@/app/(protected)/admin/lecons/(components)/edit-lesson";
import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edition de la leçon",
};

export default async function EditLeconPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  if (!slug) {
    notFound();
  }

  return (
    <>
      <PageTitle title="Edition de la leçon" />
      <EditLesson slug={slug} />
    </>
  );
}
