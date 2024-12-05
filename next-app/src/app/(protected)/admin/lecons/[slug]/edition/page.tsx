import EditLesson from "@/app/(protected)/admin/lecons/(components)/edit-lesson";
import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edition de la lecon",
};

export default async function EditLeconPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  return (
    <>
      <PageTitle title="Edition de la lecon" />
      <EditLesson slug={slug} />
    </>
  );
}
