import PageTitle from "@/components/page-title";
import { ExerciceType } from "@/type/exercice";
import ExercicesTable from "./exercices-table";

/** Formats d'exercice, par segment d'URL */
export const FORMATS = {
  carte: { type: ExerciceType.Card, label: "cartes" },
  "texte-a-trou": { type: ExerciceType.Fill_blank, label: "texte à trou" },
  "vrai-ou-faux": { type: ExerciceType.True_or_False, label: "vrai ou faux" },
  "choix-multiple": { type: ExerciceType.MultipleChoice, label: "choix multiple" },
  paires: { type: ExerciceType.MatchingPairs, label: "associer par paires" },
  ordre: { type: ExerciceType.Ordering, label: "remettre dans l'ordre" },
} as const;

export type FormatSlug = keyof typeof FORMATS;

export const isFormatSlug = (value: string): value is FormatSlug => value in FORMATS;

/** Segment d'URL de la liste d'un type d'exercice */
export const formatSlugForType = (type: string): FormatSlug | undefined =>
  (Object.keys(FORMATS) as FormatSlug[]).find((slug) => FORMATS[slug].type === type);

/** Base d'URL de la bibliothèque du professeur selon l'usage */
export const kindBasePath = (kind: "CONTROL" | "PRACTICE") =>
  kind === "CONTROL" ? "/admin/controles" : "/admin/exercices";

export const kindPageTitle = (kind: "CONTROL" | "PRACTICE", format: FormatSlug) =>
  `${kind === "CONTROL" ? "Contrôles" : "Exercices"} : ${FORMATS[format].label}`;

/**
 * Liste des contrôles (notés) ou des exercices (non notés) d'un format.
 * Les deux usages sont séparés pour que le professeur ne les confonde pas.
 */
export default function KindFormatPage({
  kind,
  format,
}: {
  kind: "CONTROL" | "PRACTICE";
  format: FormatSlug;
}) {
  return (
    <>
      <PageTitle title={kindPageTitle(kind, format)} className="mb-0" />
      <p className="-mt-4 mb-10 text-center text-muted-foreground md:-mt-12">
        {kind === "CONTROL"
          ? "Notés, une seule tentative, comptent dans la moyenne de l'élève."
          : "Non notés, essais illimités, ne comptent pas dans la moyenne de l'élève."}
      </p>
      <ExercicesTable exerciceType={FORMATS[format].type} kind={kind} />
    </>
  );
}
