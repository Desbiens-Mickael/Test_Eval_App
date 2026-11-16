import ExerciceForm from "@/app/(protected)/admin/exercices/(components)/form/exercice-form";
import PageTitle from "@/components/page-title";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ usage?: string }>;
};

/** « ?usage=controle » ou « ?usage=exercice » : l'usage est fixé par le bouton choisi */
const kindFromUsage = (usage?: string) =>
  usage === "controle" ? "CONTROL" : usage === "exercice" ? "PRACTICE" : undefined;

const titleOf = (kind?: "CONTROL" | "PRACTICE") =>
  kind === "CONTROL"
    ? "Créer un contrôle"
    : kind === "PRACTICE"
      ? "Créer un exercice"
      : "Créer un exercice ou un contrôle";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return { title: titleOf(kindFromUsage((await searchParams).usage)) };
}

export default async function ExerciceCreate({ params, searchParams }: Props) {
  const slug = (await params).slug;
  const kind = kindFromUsage((await searchParams).usage);

  return (
    <>
      <PageTitle title={titleOf(kind)} />
      <ExerciceForm lessonSlug={slug} initialKind={kind} />
    </>
  );
}
