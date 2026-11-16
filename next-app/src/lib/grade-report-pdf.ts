/**
 * Export PDF des relevés de notes, généré dans le navigateur.
 * jsPDF, jspdf-autotable et la police Roboto ne sont chargés qu'au moment
 * d'un export. Roboto est intégrée au PDF pour afficher tous les accents.
 */
import {
  GroupGradeReport,
  StudentGradeReport,
  formatDateFr,
  formatNumberFr,
  reportFileName,
} from "@/lib/grade-report";
import type { jsPDF as JsPDF } from "jspdf";

const FONT = "Roboto";
const BRAND = "EduCraft";
const PRIMARY: [number, number, number] = [234, 88, 12]; // orange de l'application
const MUTED: [number, number, number] = [100, 100, 100];
const LOW_SCORE: [number, number, number] = [180, 40, 40];

const toBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...Array.from(bytes.subarray(i, i + 0x8000)));
  }
  return btoa(binary);
};

const loadFont = async (file: string) => {
  const response = await fetch(`/fonts/${file}`);
  if (!response.ok) throw new Error(`Police introuvable : ${file}`);
  return toBase64(await response.arrayBuffer());
};

const createDocument = async (orientation: "portrait" | "landscape") => {
  const [{ jsPDF }, { default: autoTable }, regular, bold] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    loadFont("Roboto-Regular.ttf"),
    loadFont("Roboto-Bold.ttf"),
  ]);
  const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
  doc.addFileToVFS("Roboto-Regular.ttf", regular);
  doc.addFont("Roboto-Regular.ttf", FONT, "normal");
  doc.addFileToVFS("Roboto-Bold.ttf", bold);
  doc.addFont("Roboto-Bold.ttf", FONT, "bold");
  doc.setFont(FONT, "normal");
  return { doc, autoTable };
};

/** En-tête de première page : titre, sous-titre et ligne d'informations */
const drawHeader = (doc: JsPDF, title: string, subtitle: string, details: string) => {
  doc.setFont(FONT, "bold");
  doc.setFontSize(18);
  doc.setTextColor(...PRIMARY);
  doc.text(title, 14, 18);
  doc.setFont(FONT, "normal");
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text(subtitle, 14, 26);
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(details, 14, 32);
  return 38; // ordonnée de départ du contenu
};

/** Pied de page sur toutes les pages : marque, date et pagination */
const drawFooters = (doc: JsPDF, generatedAt: string) => {
  const pages = doc.getNumberOfPages();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setFont(FONT, "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`${BRAND} · édité le ${formatDateFr(generatedAt)}`, 14, height - 8);
    doc.text(`Page ${page} / ${pages}`, width - 14, height - 8, { align: "right" });
  }
};

const tableStyles = {
  styles: { font: FONT, fontSize: 9, cellPadding: 2, lineColor: [225, 224, 217] as [number, number, number], lineWidth: 0.2 },
  headStyles: { font: FONT, fontStyle: "bold" as const, fillColor: PRIMARY, textColor: 255 },
  alternateRowStyles: { fillColor: [249, 249, 247] as [number, number, number] },
  margin: { left: 14, right: 14, bottom: 16 },
};

const score = (value: number | null) => (value === null ? "—" : formatNumberFr(value));

/** Relevé d'un groupe : une ligne par élève, une colonne par exercice */
export const downloadGroupReportPdf = async (report: GroupGradeReport) => {
  const landscape = report.exercises.length > 5;
  const { doc, autoTable } = await createDocument(landscape ? "landscape" : "portrait");

  const startY = drawHeader(
    doc,
    "Relevé de notes",
    report.groupName,
    `${report.students.length} élève${report.students.length > 1 ? "s" : ""} · ` +
      `${report.exercises.length} exercice${report.exercises.length > 1 ? "s" : ""} · ` +
      `moyenne du groupe : ${score(report.average)}/20 · notes sur 20, « — » = non fait`
  );

  autoTable(doc, {
    ...tableStyles,
    startY,
    head: [["Élève", ...report.exercises.map((e) => `${e.title}\n${e.subject}`), "Faits", "Moyenne"]],
    body: report.students.map((s) => [
      s.name,
      ...s.scores.map(score),
      `${s.done}/${report.exercises.length}`,
      score(s.average),
    ]),
    foot: [["Moyenne du groupe", ...report.exercises.map((e) => score(e.average)), "", score(report.average)]],
    footStyles: { font: FONT, fontStyle: "bold", fillColor: [240, 239, 236], textColor: 20 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: landscape ? 42 : 38 } },
    didParseCell: (cell) => {
      if (cell.section === "head" && cell.column.index > 0) cell.cell.styles.halign = "center";
      if (cell.section !== "head" && cell.column.index > 0) cell.cell.styles.halign = "center";
      // Notes sous la moyenne en rouge foncé (la valeur reste lisible en noir et blanc)
      const value = Number(String(cell.cell.raw).replace(",", "."));
      const isScoreColumn = cell.column.index > 0 && cell.column.index <= report.exercises.length;
      const isAverageColumn = cell.column.index === report.exercises.length + 2;
      if (cell.section === "body" && (isScoreColumn || isAverageColumn) && !Number.isNaN(value) && value < 10) {
        cell.cell.styles.textColor = LOW_SCORE;
      }
    },
  });

  drawFooters(doc, report.generatedAt);
  doc.save(reportFileName("notes", report.groupName, new Date(report.generatedAt), "pdf"));
};

/** Relevé d'un élève : moyennes par matière puis détail des copies */
export const downloadStudentReportPdf = async (report: StudentGradeReport) => {
  const { doc, autoTable } = await createDocument("portrait");

  const startY = drawHeader(
    doc,
    "Relevé de notes",
    report.student.name,
    [
      `Identifiant : ${report.student.identifier}`,
      report.student.groupName ? `Groupe : ${report.student.groupName}` : null,
      `${report.rows.length} copie${report.rows.length > 1 ? "s" : ""}`,
      `moyenne générale : ${score(report.average)}/20`,
    ]
      .filter(Boolean)
      .join(" · ")
  );

  autoTable(doc, {
    ...tableStyles,
    startY,
    head: [["Matière", "Copies", "Moyenne /20"]],
    body: report.bySubject.map((s) => [s.subject, s.count, score(s.average)]),
    foot: [["Moyenne générale", report.rows.length, score(report.average)]],
    footStyles: { font: FONT, fontStyle: "bold", fillColor: [240, 239, 236], textColor: 20 },
    tableWidth: 110,
    didParseCell: (cell) => {
      // Les colonnes chiffrées restent centrées, y compris sur la ligne de total
      if (cell.column.index > 0) cell.cell.styles.halign = "center";
    },
  });

  const afterSummary = (doc as JsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? startY;

  autoTable(doc, {
    ...tableStyles,
    startY: afterSummary + 8,
    head: [["Date", "Matière", "Exercice", "Note", "/20", "Commentaire du professeur"]],
    body: report.rows.map((r) => [
      formatDateFr(r.date),
      r.subject,
      r.title,
      `${formatNumberFr(r.note)}/${r.coeficient}${r.adjusted ? " *" : ""}`,
      formatNumberFr(r.score),
      r.comment ?? "",
    ]),
    columnStyles: {
      0: { cellWidth: 23 },
      3: { halign: "center", cellWidth: 18 },
      4: { halign: "center", cellWidth: 12 },
      5: { cellWidth: 60 },
    },
    didParseCell: (cell) => {
      const value = Number(String(cell.cell.raw).replace(",", "."));
      if (cell.section === "body" && cell.column.index === 4 && value < 10) {
        cell.cell.styles.textColor = LOW_SCORE;
      }
    },
  });

  if (report.rows.some((r) => r.adjusted)) {
    const y = (doc as JsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 0;
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("* note ajustée par le professeur après correction", 14, y + 6);
  }

  drawFooters(doc, report.generatedAt);
  doc.save(reportFileName("releve", report.student.name, new Date(report.generatedAt), "pdf"));
};
