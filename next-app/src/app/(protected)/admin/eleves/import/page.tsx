import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import StudentImport from "./(components)/student-import";

export const metadata: Metadata = {
  title: "Importer des élèves",
};

export default function ImportStudentsPage() {
  return (
    <>
      <PageTitle title="Importer des élèves" className="mb-0" />
      <p className="-mt-4 mb-8 text-center text-muted-foreground md:-mt-12">
        Depuis un fichier CSV, un fichier Excel ou un copier-coller depuis votre tableur.
      </p>
      <StudentImport />
    </>
  );
}
