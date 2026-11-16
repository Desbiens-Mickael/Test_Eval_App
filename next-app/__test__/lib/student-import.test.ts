/**
 * @jest-environment node
 */
import {
  IMPORT_TEMPLATE_CSV,
  MAX_IMPORT_ROWS,
  assignIdentifiers,
  buildIdentifierBase,
  checkImportRows,
  decodeTextFile,
  detectDelimiter,
  formatPersonName,
  parseDelimitedText,
  parseImportText,
  tableToRows,
} from "@/lib/student-import";
import { readXlsxTable } from "@/lib/student-import-excel";
import ExcelJS from "exceljs";

describe("decodeTextFile", () => {
  it("lit l'UTF-8 et retire le BOM", () => {
    const bytes = new TextEncoder().encode("﻿Prénom;Nom\nChloé;Lefèvre");
    expect(decodeTextFile(bytes)).toBe("Prénom;Nom\nChloé;Lefèvre");
  });

  it("lit un CSV Windows-1252 enregistré par Excel", () => {
    // « Chloé » en Windows-1252 : é = 0xE9 (invalide en UTF-8)
    const bytes = new Uint8Array([0x43, 0x68, 0x6c, 0x6f, 0xe9]);
    expect(decodeTextFile(bytes)).toBe("Chloé");
  });
});

describe("detectDelimiter / parseDelimitedText", () => {
  it("détecte ; , et tabulation", () => {
    expect(detectDelimiter("Prénom;Nom;Groupe")).toBe(";");
    expect(detectDelimiter("Prénom,Nom")).toBe(",");
    expect(detectDelimiter("Prénom\tNom\tGroupe")).toBe("\t");
  });

  it("gère guillemets, séparateurs et retours à la ligne dans un champ", () => {
    const table = parseDelimitedText('Prénom;Nom\r\n"Anne;Marie";"D\'Arc ""la"" grande"\r\n');
    expect(table).toEqual([
      ["Prénom", "Nom"],
      ["Anne;Marie", 'D\'Arc "la" grande'],
    ]);
  });
});

describe("parseImportText", () => {
  it("repère les colonnes par leur en-tête, dans n'importe quel ordre", () => {
    const result = parseImportText("Classe;NOM;Prénom\nCM1;Martin;Léa\n");
    expect(result.hasHeader).toBe(true);
    expect(result.rows).toEqual([
      { line: 2, firstname: "Léa", lastname: "Martin", group: "CM1" },
    ]);
  });

  it("utilise l'ordre Prénom, Nom, Groupe sans en-tête (copier-coller)", () => {
    const pasted = "Léa\tMartin\tCM1\nHugo\tBernard\t\n";
    const result = parseImportText(pasted);
    expect(result.hasHeader).toBe(false);
    expect(result.rows.map((r) => [r.firstname, r.lastname, r.group])).toEqual([
      ["Léa", "Martin", "CM1"],
      ["Hugo", "Bernard", ""],
    ]);
  });

  it("ignore les lignes vides et garde le bon numéro de ligne", () => {
    const result = parseImportText("Prénom;Nom\n\nLéa;Martin\n;\n");
    expect(result.rows).toEqual([{ line: 3, firstname: "Léa", lastname: "Martin", group: "" }]);
  });

  it("signale un en-tête incomplet ou un tableau vide", () => {
    expect(parseImportText("Prénom;Classe\nLéa;CM1").error).toMatch(/colonne « Nom »/);
    expect(parseImportText("  \n").error).toBe("Le tableau est vide.");
  });

  it(`limite l'import à ${MAX_IMPORT_ROWS} élèves`, () => {
    const lines = Array.from({ length: MAX_IMPORT_ROWS + 1 }, (_, i) => `Eleve${i};Test`);
    expect(parseImportText(`Prénom;Nom\n${lines.join("\n")}`).error).toMatch(/limité/);
  });

  it("lit le modèle proposé au téléchargement", () => {
    const result = parseImportText(decodeTextFile(new TextEncoder().encode(IMPORT_TEMPLATE_CSV)));
    expect(result.error).toBeUndefined();
    expect(result.rows).toHaveLength(2);
  });
});

describe("readXlsxTable", () => {
  it("lit la première feuille d'un fichier Excel", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Élèves");
    sheet.addRow(["Prénom", "Nom", "Groupe"]);
    sheet.addRow(["Chloé", "Lefèvre", "CM2"]);
    sheet.addRow([]);
    sheet.addRow(["Hugo", { formula: '"Ber"&"nard"', result: "Bernard" }, ""]);
    const buffer = await workbook.xlsx.writeBuffer();

    const rows = tableToRows(await readXlsxTable(buffer as ArrayBuffer)).rows;
    expect(rows.map((r) => [r.firstname, r.lastname, r.group])).toEqual([
      ["Chloé", "Lefèvre", "CM2"],
      ["Hugo", "Bernard", ""],
    ]);
  });
});

describe("checkImportRows", () => {
  const row = (line: number, firstname: string, lastname: string, group = "") => ({
    line,
    firstname,
    lastname,
    group,
  });

  it("signale les noms manquants ou invalides comme erreurs", () => {
    const [missing, invalid] = checkImportRows(
      [row(2, "", "Martin"), row(3, "Léa", "Martin<script>")],
      []
    );
    expect(missing.issues).toEqual([{ type: "error", message: "Prénom manquant" }]);
    expect(invalid.issues[0]).toMatchObject({ type: "error" });
  });

  it("accepte accents, tirets et apostrophes", () => {
    const [ok] = checkImportRows([row(2, "Jean-Noël", "D'Artagnan")], []);
    expect(ok.issues).toEqual([]);
  });

  it("avertit pour un groupe inconnu (sans tenir compte des accents ni de la casse)", () => {
    const [known, unknown] = checkImportRows(
      [row(2, "Léa", "Martin", "cm1 explorateurs"), row(3, "Hugo", "Bernard", "CE1")],
      ["CM1 Explorateurs"]
    );
    expect(known.issues).toEqual([]);
    expect(unknown.issues[0]).toMatchObject({ type: "warning" });
  });

  it("avertit pour un homonyme dans le fichier", () => {
    const checked = checkImportRows([row(2, "Léa", "Martin"), row(5, "LEA", "martin")], []);
    expect(checked[1].issues[0].message).toMatch(/ligne 2/);
  });
});

describe("noms et identifiants", () => {
  it("met en forme les noms", () => {
    expect(formatPersonName("  jean-PIERRE  d'arc ")).toBe("Jean-Pierre D'Arc");
    expect(formatPersonName("dupont DE LA tour")).toBe("Dupont de la Tour");
    expect(formatPersonName("de gaulle")).toBe("De Gaulle");
    expect(formatPersonName("n'diaye")).toBe("N'Diaye");
  });

  it("construit un identifiant sans accents ni espaces", () => {
    expect(buildIdentifierBase("Élodie", "Dupont de la Tour")).toBe("e.dupont-de-la-tour");
    expect(buildIdentifierBase("Zoé", "N'Diaye")).toBe("z.n-diaye");
  });

  it("attribue des identifiants libres, y compris entre homonymes", () => {
    expect(
      assignIdentifiers(["l.martin", "l.martin", "h.bernard"], ["l.martin", "l.martin-02"])
    ).toEqual(["l.martin-03", "l.martin-04", "h.bernard"]);
  });
});
