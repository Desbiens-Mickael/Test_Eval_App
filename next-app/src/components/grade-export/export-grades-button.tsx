"use client";

import {
  getGroupGradeReportAction,
  getStudentGradeReportAction,
} from "@/actions/grade-report.action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  groupReportToCsv,
  reportFileName,
  studentReportToCsv,
} from "@/lib/grade-report";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Format = "csv" | "pdf";

const downloadText = (content: string, filename: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/** Export des notes d'un groupe ou d'un élève, en CSV (Excel) ou en PDF */
export default function ExportGradesButton({
  kind,
  id,
  className,
}: {
  kind: "group" | "student";
  id: string;
  className?: string;
}) {
  const [pending, setPending] = useState<Format | null>(null);

  const exportAs = async (format: Format) => {
    setPending(format);
    try {
      if (kind === "group") {
        const response = await getGroupGradeReportAction(id);
        if (!response.data) throw new Error(response.error);
        const report = response.data;
        if (report.students.length === 0 || report.exercises.length === 0) {
          toast.info("Ce groupe n'a pas encore d'élève ou d'exercice attribué : rien à exporter.");
          return;
        }
        if (format === "csv") {
          downloadText(
            groupReportToCsv(report),
            reportFileName("notes", report.groupName, new Date(report.generatedAt), "csv")
          );
        } else {
          const { downloadGroupReportPdf } = await import("@/lib/grade-report-pdf");
          await downloadGroupReportPdf(report);
        }
      } else {
        const response = await getStudentGradeReportAction(id);
        if (!response.data) throw new Error(response.error);
        const report = response.data;
        if (report.rows.length === 0) {
          toast.info("Cet élève n'a encore rendu aucune copie : rien à exporter.");
          return;
        }
        if (format === "csv") {
          downloadText(
            studentReportToCsv(report),
            reportFileName("releve", report.student.name, new Date(report.generatedAt), "csv")
          );
        } else {
          const { downloadStudentReportPdf } = await import("@/lib/grade-report-pdf");
          await downloadStudentReportPdf(report);
        }
      }
      toast.success(format === "csv" ? "Fichier CSV téléchargé." : "Relevé PDF téléchargé.");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Une erreur est survenue pendant l'export."
      );
    } finally {
      setPending(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className} disabled={pending !== null}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          )}
          {kind === "group" ? "Exporter les notes" : "Exporter le relevé"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => exportAs("pdf")}>
          <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
          PDF (à imprimer ou partager)
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportAs("csv")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
          CSV (pour Excel)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
