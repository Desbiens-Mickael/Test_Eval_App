"use client";

import type { ImportedStudent } from "@/actions/student-import.action";
import { useImportStudents } from "@/hooks/mutations/student/use-import-students";
import { useGetAllGroups } from "@/hooks/queries/group/use-get-all-groups";
import { CheckedImportRow, ParsedImport, checkImportRows } from "@/lib/student-import";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import ImportPreview from "./import-preview";
import ImportResult from "./import-result";
import ImportSource from "./import-source";

type Step =
  | { name: "source"; error?: string }
  | { name: "preview"; rows: CheckedImportRow[]; source: string; hasHeader: boolean }
  | { name: "result"; students: ImportedStudent[]; emailSent: boolean };

const STEPS = ["Choisir la liste", "Vérifier", "Identifiants"];

/** Import d'élèves en trois étapes : source → aperçu → identifiants */
export default function StudentImport() {
  const [step, setStep] = useState<Step>({ name: "source" });
  const { data: groups } = useGetAllGroups();
  const { mutateAsync, isPending } = useImportStudents();
  const stepIndex = step.name === "source" ? 0 : step.name === "preview" ? 1 : 2;

  const handleParsed = (result: ParsedImport, source: string) => {
    if (result.error) {
      setStep({ name: "source", error: result.error });
      return;
    }
    setStep({
      name: "preview",
      rows: checkImportRows(result.rows, (groups ?? []).map((g) => g.name)),
      source,
      hasHeader: result.hasHeader,
    });
  };

  const handleImport = async (rows: CheckedImportRow[]) => {
    const response = await mutateAsync(
      rows.map(({ line, firstname, lastname, group }) => ({ line, firstname, lastname, group }))
    );
    if (response?.data) {
      setStep({ name: "result", ...response.data });
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <ol className="mx-auto flex w-full max-w-3xl items-center gap-2" aria-label="Étapes de l'import">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              aria-current={i === stepIndex ? "step" : undefined}
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                i < stepIndex && "border-primary bg-primary text-primary-foreground",
                i === stepIndex && "border-primary text-primary",
                i > stepIndex && "text-muted-foreground"
              )}
            >
              {i + 1}
            </span>
            <span className={cn("text-sm", i === stepIndex ? "font-medium" : "text-muted-foreground")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      {step.name === "source" && (
        <>
          {step.error && (
            <p
              role="alert"
              className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
              {step.error}
            </p>
          )}
          <ImportSource onParsed={handleParsed} />
        </>
      )}

      {step.name === "preview" && (
        <ImportPreview
          rows={step.rows}
          source={step.source}
          hasHeader={step.hasHeader}
          isImporting={isPending}
          onCancel={() => setStep({ name: "source" })}
          onImport={handleImport}
        />
      )}

      {step.name === "result" && (
        <ImportResult
          students={step.students}
          emailSent={step.emailSent}
          onRestart={() => setStep({ name: "source" })}
        />
      )}
    </div>
  );
}
