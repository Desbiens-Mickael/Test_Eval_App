"use client";

import type { ImportedStudent } from "@/actions/student-import.action";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Printer } from "lucide-react";
import Link from "next/link";

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

/** Fiche des identifiants au format CSV (séparateur « ; », ouvrable dans Excel) */
const downloadCredentials = (students: ImportedStudent[]) => {
  const lines = [
    ["Élève", "Groupe", "Identifiant", "Mot de passe"],
    ...students.map((s) => [s.name, s.group ?? "", s.identifier, s.password]),
  ].map((cells) => cells.map(csvCell).join(";"));
  const blob = new Blob([`﻿${lines.join("\r\n")}\r\n`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "identifiants-eleves.csv";
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Impression : une fiche par élève, à découper et distribuer.
 * Le document est construit avec textContent (aucun nom n'est interprété comme du HTML).
 */
const printCredentials = (students: ImportedStudent[]) => {
  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) return;
  const doc = win.document;
  doc.title = "Identifiants des élèves";
  const style = doc.createElement("style");
  style.textContent = `
    body { font-family: system-ui, sans-serif; margin: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { border: 1px dashed #999; border-radius: 8px; padding: 12px 16px; break-inside: avoid; }
    .name { font-weight: 600; font-size: 16px; margin-bottom: 8px; }
    .label { color: #555; font-size: 12px; }
    .value { font-family: ui-monospace, monospace; font-size: 18px; font-weight: 600; margin-bottom: 6px; }
  `;
  doc.head.appendChild(style);
  const grid = doc.createElement("div");
  grid.className = "grid";
  for (const s of students) {
    const card = doc.createElement("div");
    card.className = "card";
    const add = (className: string, text: string) => {
      const el = doc.createElement("div");
      el.className = className;
      el.textContent = text;
      card.appendChild(el);
    };
    add("name", s.group ? `${s.name} · ${s.group}` : s.name);
    add("label", "Identifiant");
    add("value", s.identifier);
    add("label", "Mot de passe");
    add("value", s.password);
    grid.appendChild(card);
  }
  doc.body.appendChild(grid);
  win.focus();
  win.print();
};

/** Étape 3 : identifiants des élèves créés, affichés une seule fois */
export default function ImportResult({
  students,
  emailSent,
  onRestart,
}: {
  students: ImportedStudent[];
  emailSent: boolean;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="rounded-xl border border-green-600/30 bg-green-600/5 p-4">
        <p className="flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
          {students.length} compte{students.length > 1 ? "s" : ""} créé{students.length > 1 ? "s" : ""}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Les mots de passe ne seront plus affichés après avoir quitté cette page : imprimez ou
          téléchargez la fiche maintenant.
          {emailSent && " Une copie vous a aussi été envoyée par email."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => printCredentials(students)}>
            <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
            Imprimer les fiches
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => downloadCredentials(students)}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Télécharger (CSV)
          </Button>
        </div>
      </div>

      <div className="overflow-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-3 py-2 font-medium">Élève</th>
              <th className="px-3 py-2 font-medium">Groupe</th>
              <th className="px-3 py-2 font-medium">Identifiant</th>
              <th className="px-3 py-2 font-medium">Mot de passe</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map((s) => (
              <tr key={s.identifier}>
                <td className="px-3 py-2 font-medium">{s.name}</td>
                <td className="px-3 py-2">{s.group ?? <span className="text-muted-foreground">—</span>}</td>
                <td className="select-all px-3 py-2 font-mono">{s.identifier}</td>
                <td className="select-all px-3 py-2 font-mono">{s.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" onClick={onRestart}>
          Importer une autre liste
        </Button>
        <Button asChild>
          <Link href="/admin/eleves">Voir mes élèves</Link>
        </Button>
      </div>
    </div>
  );
}
