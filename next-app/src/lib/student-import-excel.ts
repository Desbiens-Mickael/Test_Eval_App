/**
 * Lecture de la première feuille d'un fichier Excel (.xlsx) en tableau de texte.
 * exceljs est chargé à la demande : il ne pèse sur la page que si un fichier
 * Excel est effectivement déposé.
 */
export const readXlsxTable = async (data: ArrayBuffer): Promise<string[][]> => {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(data);

  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  const table: string[][] = [];
  sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    const cells: string[] = [];
    for (let col = 1; col <= sheet.columnCount; col++) {
      // `text` donne la valeur affichée (résultat des formules, texte enrichi…)
      cells.push(row.getCell(col).text ?? "");
    }
    table[rowNumber - 1] = cells;
  });
  // Lignes absentes (entièrement vides) : tableau sans trous
  return Array.from(table, (cells) => cells ?? []);
};
