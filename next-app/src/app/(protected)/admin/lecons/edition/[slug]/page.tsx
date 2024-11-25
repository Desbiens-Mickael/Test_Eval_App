import EditLesson from "@/components/lesson/edit-lesson";
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
    <div className="w-full h-full">
      <h1 className="text-4xl font-semibold mb-8 text-center">
        Edition de la lecon
      </h1>
      <EditLesson slug={slug} />
    </div>
  );
}
