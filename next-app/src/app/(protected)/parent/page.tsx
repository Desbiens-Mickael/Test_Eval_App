import { getMyChildrenAction } from "@/actions/parent.action";
import PageTitle from "@/components/page-title";
import { generateUserInitials } from "@/lib/utils";
import { ChevronRight, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Mes enfants",
};

export const dynamic = "force-dynamic";

/** Accueil de l'espace parent : les enfants suivis */
export default async function ParentHome() {
  const response = await getMyChildrenAction();
  if ("error" in response) {
    return <div className="rounded-xl border bg-card p-6 text-muted-foreground">{response.error}</div>;
  }

  const children = response.data;
  // Un seul enfant : directement sa page
  if (children.length === 1) redirect(`/parent/enfants/${children[0].id}`);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageTitle title="Mes enfants" />
      {children.length === 0 ? (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center">
          <Users className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          <p className="font-medium">Aucun enfant à suivre pour le moment.</p>
          <p className="text-sm text-muted-foreground">
            Le professeur de votre enfant doit renseigner votre adresse e-mail sur sa fiche.
          </p>
        </div>
      ) : (
        <ul className="mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-2">
          {children.map((child) => (
            <li key={child.id}>
              <Link
                href={`/parent/enfants/${child.id}`}
                className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary"
                  aria-hidden="true"
                >
                  {generateUserInitials(child.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{child.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {[child.groupName, child.teacherName && `avec ${child.teacherName}`]
                      .filter(Boolean)
                      .join(" · ") || "Sans groupe"}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
