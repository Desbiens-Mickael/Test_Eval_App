"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  IMPORT_TEMPLATE_CSV,
  IMPORT_TEMPLATE_HEADERS,
  MAX_IMPORT_ROWS,
  ParsedImport,
  decodeTextFile,
  parseImportText,
  tableToRows,
} from "@/lib/student-import";
import { readXlsxTable } from "@/lib/student-import-excel";
import { cn } from "@/lib/utils";
import { ClipboardPaste, Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Mo, largement assez pour une classe

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadCsvTemplate = () =>
  downloadBlob(
    new Blob([IMPORT_TEMPLATE_CSV], { type: "text/csv;charset=utf-8" }),
    "modele-import-eleves.csv"
  );

const downloadXlsxTemplate = async () => {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Élèves");
  sheet.addRow(IMPORT_TEMPLATE_HEADERS);
  sheet.addRow(["Léa", "Martin", "CM1 Explorateurs"]);
  sheet.addRow(["Hugo", "Bernard", "CM1 Explorateurs"]);
  sheet.getRow(1).font = { bold: true };
  sheet.columns.forEach((column) => (column.width = 22));
  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "modele-import-eleves.xlsx"
  );
};

/** Lecture d'un fichier déposé : Excel ou texte (CSV / TSV) */
const readImportFile = async (file: File): Promise<ParsedImport> => {
  const buffer = await file.arrayBuffer();
  if (/\.xlsx$/i.test(file.name)) {
    return tableToRows(await readXlsxTable(buffer));
  }
  return parseImportText(decodeTextFile(new Uint8Array(buffer)));
};

/** Étape 1 : choisir la source (fichier ou copier-coller) */
export default function ImportSource({
  onParsed,
}: {
  onParsed: (result: ParsedImport, source: string) => void;
}) {
  const [pasted, setPasted] = useState("");
  const [isReading, setIsReading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxSize: MAX_FILE_SIZE,
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".txt", ".tsv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    onDropRejected: (rejections) => {
      const code = rejections[0]?.errors[0]?.code;
      toast.error(
        code === "file-too-large"
          ? "Fichier trop volumineux (2 Mo maximum)."
          : "Format non pris en charge : utilisez un fichier .csv ou .xlsx."
      );
    },
    onDropAccepted: async ([file]) => {
      setIsReading(true);
      try {
        onParsed(await readImportFile(file), file.name);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de lire ce fichier. Vérifiez qu'il s'agit bien d'un CSV ou d'un Excel.");
      } finally {
        setIsReading(false);
      }
    },
  });

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Tabs defaultValue="file">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
            Fichier CSV ou Excel
          </TabsTrigger>
          <TabsTrigger value="paste">
            <ClipboardPaste className="mr-2 h-4 w-4" aria-hidden="true" />
            Copier-coller
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="mt-4">
          <div
            {...getRootProps()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-card px-6 py-12 text-center transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isDragActive ? "border-primary bg-primary/5" : "hover:border-primary/60"
            )}
          >
            <input {...getInputProps()} aria-label="Fichier de la liste d'élèves" />
            {isReading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            ) : (
              <Upload className="h-8 w-8 text-primary" aria-hidden="true" />
            )}
            <div>
              <p className="font-medium">
                {isDragActive ? "Déposez le fichier ici" : "Glissez votre fichier ici, ou cliquez pour le choisir"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                .csv ou .xlsx · {MAX_IMPORT_ROWS} élèves maximum · séparateur et accents détectés
                automatiquement
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="paste" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Dans Excel, sélectionnez les colonnes Prénom, Nom et (si besoin) Groupe, copiez-les
            avec Ctrl+C puis collez-les ici. La ligne d&apos;en-têtes est facultative.
          </p>
          <Textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            rows={10}
            className="font-mono text-sm"
            placeholder={"Prénom\tNom\tGroupe\nLéa\tMartin\tCM1 Explorateurs\nHugo\tBernard\tCM1 Explorateurs"}
            aria-label="Liste d'élèves copiée depuis un tableur"
          />
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={!pasted.trim()}
              onClick={() => onParsed(parseImportText(pasted), "copier-coller")}
            >
              Analyser la liste
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-sm font-medium">Besoin d&apos;un point de départ ?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Le modèle contient les colonnes Prénom, Nom et Groupe. Le groupe est facultatif ; il
          doit correspondre au nom d&apos;un de vos groupes.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={downloadXlsxTemplate}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Modèle Excel (.xlsx)
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={downloadCsvTemplate}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Modèle CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
