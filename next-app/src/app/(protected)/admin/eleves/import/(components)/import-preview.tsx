"use client";

import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { CheckedImportRow, formatPersonName } from "@/lib/student-import";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ImportPreviewProps {
  rows: CheckedImportRow[];
  source: string;
  hasHeader: boolean;
  isImporting: boolean;
  onCancel: () => void;
  onImport: (rows: CheckedImportRow[]) => void;
}

/** Étape 2 : aperçu des élèves détectés, ligne par ligne */
export default function ImportPreview({
  rows,
  source,
  hasHeader,
  isImporting,
  onCancel,
  onImport,
}: ImportPreviewProps) {
  const hasError = (row: CheckedImportRow) => row.issues.some((i) => i.type === "error");
  const valid = rows.filter((r) => !hasError(r));
  const errors = rows.length - valid.length;
  const warnings = valid.filter((r) => r.issues.length > 0).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border bg-card p-4 text-sm">
        <span className="font-medium">
          {rows.length} ligne{rows.length > 1 ? "s" : ""} lue{rows.length > 1 ? "s" : ""} ·{" "}
          <span className="text-muted-foreground">{source}</span>
          {!hasHeader && (
            <span className="text-muted-foreground"> (colonnes lues dans l&apos;ordre Prénom, Nom, Groupe)</span>
          )}
        </span>
        <Status icon={CheckCircle2} color="text-green-600 dark:text-green-400" label={`${valid.length} prêt${valid.length > 1 ? "s" : ""}`} />
        {warnings > 0 && (
          <Status icon={AlertTriangle} color="text-amber-600 dark:text-amber-400" label={`${warnings} à vérifier`} />
        )}
        {errors > 0 && (
          <Status icon={XCircle} color="text-red-600 dark:text-red-400" label={`${errors} en erreur, ignorée${errors > 1 ? "s" : ""}`} />
        )}
      </div>

      <div className="max-h-[480px] overflow-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card shadow-[0_1px_0_hsl(var(--border))]">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">Ligne</th>
              <th className="px-3 py-2 font-medium">Prénom</th>
              <th className="px-3 py-2 font-medium">Nom</th>
              <th className="px-3 py-2 font-medium">Groupe</th>
              <th className="px-3 py-2 font-medium">E-mail du parent</th>
              <th className="px-3 py-2 font-medium">Vérification</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.line} className={hasError(row) ? "bg-red-500/5" : undefined}>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{row.line}</td>
                <td className="px-3 py-2">{row.firstname ? formatPersonName(row.firstname) : "—"}</td>
                <td className="px-3 py-2">{row.lastname ? formatPersonName(row.lastname) : "—"}</td>
                <td className="px-3 py-2">{row.group || <span className="text-muted-foreground">—</span>}</td>
                <td className="max-w-[14rem] truncate px-3 py-2">
                  {row.parentEmail?.trim() || <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-3 py-2">
                  {row.issues.length === 0 ? (
                    <Status icon={CheckCircle2} color="text-green-600 dark:text-green-400" label="OK" />
                  ) : (
                    <ul className="space-y-1">
                      {row.issues.map((issue) => (
                        <li key={issue.message}>
                          <Status
                            icon={issue.type === "error" ? XCircle : AlertTriangle}
                            color={
                              issue.type === "error"
                                ? "text-red-600 dark:text-red-400"
                                : "text-amber-600 dark:text-amber-400"
                            }
                            label={issue.message}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <p className="mr-auto text-sm text-muted-foreground">
          Un identifiant et un mot de passe seront créés pour chaque élève.
        </p>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isImporting}>
          Choisir une autre liste
        </Button>
        <SubmitButton
          texte={`Importer ${valid.length} élève${valid.length > 1 ? "s" : ""}`}
          loadindText="Création des comptes..."
          isLoading={isImporting}
          disabled={valid.length === 0}
          onClick={() => onImport(valid)}
          className="w-auto text-base"
        />
      </div>
    </div>
  );
}

function Status({
  icon: Icon,
  color,
  label,
}: {
  icon: typeof CheckCircle2;
  color: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-start gap-1.5">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
