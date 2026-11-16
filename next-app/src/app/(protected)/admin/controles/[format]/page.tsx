import KindFormatPage, {
  isFormatSlug,
  kindPageTitle,
} from "@/app/(protected)/admin/exercices/(components)/kind-format-page";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ format: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { format } = await params;
  return { title: isFormatSlug(format) ? kindPageTitle("CONTROL", format) : "Contrôles" };
}

export default async function ControlFormatPage({ params }: Props) {
  const { format } = await params;
  if (!isFormatSlug(format)) notFound();

  return <KindFormatPage kind="CONTROL" format={format} />;
}
