/**
 * Import d'élèves en masse : lecture d'un tableau (CSV, Excel ou copier-coller),
 * validation des lignes et génération des identifiants.
 *
 * Module pur, utilisé à la fois dans le navigateur (aperçu) et sur le serveur
 * (validation finale). La lecture des fichiers .xlsx est dans student-import-excel.ts.
 */

export const MAX_IMPORT_ROWS = 100;
export const MAX_NAME_LENGTH = 50;
export const IMPORT_TEMPLATE_HEADERS = ["Prénom", "Nom", "Groupe", "E-mail du parent"];
export const MAX_EMAIL_LENGTH = 254;

export type ImportRow = {
  /** Numéro de ligne dans le fichier d'origine (1 = première ligne) */
  line: number;
  firstname: string;
  lastname: string;
  group: string;
  /** Facultatif : renseigné, l'espace parent est créé et ses accès envoyés */
  parentEmail?: string;
};

export type ImportIssue = { type: "error" | "warning"; message: string };

export type CheckedImportRow = ImportRow & { issues: ImportIssue[] };

export type ParsedImport = {
  rows: ImportRow[];
  /** true si une ligne d'en-têtes (Prénom, Nom…) a été reconnue */
  hasHeader: boolean;
  /** Message si le tableau ne peut pas être exploité */
  error?: string;
};

// ---------------------------------------------------------------------------
// Texte et encodage
// ---------------------------------------------------------------------------

/** Minuscules sans accents ni espaces superflus, pour comparer des libellés */
export const normalizeLabel = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

/**
 * Décode un fichier texte : UTF-8 (avec ou sans BOM) si possible, sinon
 * Windows-1252, l'encodage des CSV enregistrés par un Excel français.
 */
export const decodeTextFile = (bytes: Uint8Array) => {
  try {
    return new TextDecoder("utf-8", { fatal: true })
      .decode(bytes)
      .replace(/^﻿/, "");
  } catch {
    return new TextDecoder("windows-1252").decode(bytes);
  }
};

const DELIMITERS = ["\t", ";", ","] as const;

/** Séparateur le plus présent sur la première ligne non vide (hors guillemets) */
export const detectDelimiter = (text: string) => {
  const firstLine = text.split(/\r?\n/).find((l) => l.trim() !== "") ?? "";
  const unquoted = firstLine.replace(/"[^"]*"/g, "");
  let best: string = ",";
  let bestCount = 0;
  for (const d of DELIMITERS) {
    const count = unquoted.split(d).length - 1;
    if (count > bestCount) {
      best = d;
      bestCount = count;
    }
  }
  return best;
};

/** Lit un CSV / TSV (guillemets, séparateurs et retours à la ligne dans les champs) */
export const parseDelimitedText = (text: string, delimiter = detectDelimiter(text)) => {
  const table: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"' && field === "") {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      table.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    table.push(row);
  }
  return table;
};

// ---------------------------------------------------------------------------
// Du tableau aux lignes d'élèves
// ---------------------------------------------------------------------------

const HEADER_ALIASES: Record<keyof Omit<ImportRow, "line">, string[]> = {
  firstname: ["prenom", "prenoms", "first name", "firstname", "prenom de l'eleve"],
  lastname: ["nom", "nom de famille", "last name", "lastname", "nom de l'eleve"],
  group: ["groupe", "classe", "group", "class", "division"],
  // Les élèves n'ont pas d'e-mail : une colonne « E-mail » est celle du parent
  parentEmail: [
    "e-mail du parent",
    "email du parent",
    "e-mail parent",
    "email parent",
    "e-mail des parents",
    "email des parents",
    "mail du parent",
    "mail parent",
    "courriel du parent",
    "courriel parent",
    "courriel des parents",
    "mail des parents",
    "e-mail",
    "email",
    "mail",
    "courriel",
  ],
};

const findColumn = (headers: string[], aliases: string[]) =>
  headers.findIndex((h) => aliases.includes(normalizeLabel(h)));

/**
 * Transforme un tableau en lignes d'élèves. Les colonnes sont repérées par
 * leur en-tête (Prénom, Nom, Groupe…) ; sans en-tête reconnu, l'ordre
 * Prénom, Nom, Groupe est utilisé.
 */
export const tableToRows = (table: string[][]): ParsedImport => {
  const nonEmpty = table
    .map((cells, index) => ({ cells: cells.map((c) => c.trim()), line: index + 1 }))
    .filter(({ cells }) => cells.some((c) => c !== ""));

  if (nonEmpty.length === 0) {
    return { rows: [], hasHeader: false, error: "Le tableau est vide." };
  }

  const headers = nonEmpty[0].cells;
  const firstnameCol = findColumn(headers, HEADER_ALIASES.firstname);
  const lastnameCol = findColumn(headers, HEADER_ALIASES.lastname);
  const hasHeader = firstnameCol !== -1 && lastnameCol !== -1;

  if (!hasHeader && (firstnameCol !== -1 || lastnameCol !== -1)) {
    return {
      rows: [],
      hasHeader: false,
      error: "Il faut une colonne « Prénom » et une colonne « Nom ».",
    };
  }

  const columns = hasHeader
    ? {
        firstname: firstnameCol,
        lastname: lastnameCol,
        group: findColumn(headers, HEADER_ALIASES.group),
        parentEmail: findColumn(headers, HEADER_ALIASES.parentEmail),
      }
    : { firstname: 0, lastname: 1, group: 2, parentEmail: 3 };

  const dataRows = hasHeader ? nonEmpty.slice(1) : nonEmpty;
  const rows = dataRows.map(({ cells, line }) => ({
    line,
    firstname: cells[columns.firstname] ?? "",
    lastname: cells[columns.lastname] ?? "",
    group: columns.group === -1 ? "" : cells[columns.group] ?? "",
    parentEmail: columns.parentEmail === -1 ? "" : cells[columns.parentEmail] ?? "",
  }));

  if (rows.length === 0) {
    return { rows, hasHeader, error: "Aucun élève trouvé sous la ligne d'en-têtes." };
  }
  if (rows.length > MAX_IMPORT_ROWS) {
    return {
      rows,
      hasHeader,
      error: `${rows.length} élèves trouvés : l'import est limité à ${MAX_IMPORT_ROWS} élèves à la fois.`,
    };
  }
  return { rows, hasHeader };
};

/** CSV, TSV ou cellules collées depuis un tableur */
export const parseImportText = (text: string) => tableToRows(parseDelimitedText(text));

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

// Adresse e-mail simple : quelque chose@domaine.extension, sans espace
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lettres de toutes les langues (accents compris), espaces, apostrophes, points et tirets
const NAME_PATTERN = new RegExp("^\\p{L}[\\p{L}\\p{M} '’.-]*$", "u");

/**
 * Vérifie chaque ligne. Les erreurs empêchent l'import de la ligne ;
 * les avertissements l'autorisent (homonyme, groupe inconnu…).
 */
export const checkImportRows = (
  rows: ImportRow[],
  groupNames: string[]
): CheckedImportRow[] => {
  const knownGroups = new Set(groupNames.map(normalizeLabel));
  const seen = new Map<string, number>();

  return rows.map((row) => {
    const issues: ImportIssue[] = [];
    const check = (value: string, label: string) => {
      if (!value) issues.push({ type: "error", message: `${label} manquant` });
      else if (value.length > MAX_NAME_LENGTH)
        issues.push({ type: "error", message: `${label} trop long (${MAX_NAME_LENGTH} caractères max)` });
      else if (!NAME_PATTERN.test(value))
        issues.push({ type: "error", message: `${label} : caractères non autorisés` });
    };
    check(row.firstname, "Prénom");
    check(row.lastname, "Nom");

    const parentEmail = row.parentEmail?.trim() ?? "";
    if (parentEmail && (parentEmail.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(parentEmail))) {
      issues.push({ type: "error", message: `E-mail du parent invalide : « ${parentEmail} »` });
    }

    if (row.group && !knownGroups.has(normalizeLabel(row.group))) {
      issues.push({
        type: "warning",
        message: `Groupe « ${row.group} » inconnu : l'élève sera créé sans groupe`,
      });
    }

    const key = `${normalizeLabel(row.firstname)}|${normalizeLabel(row.lastname)}`;
    const previous = seen.get(key);
    if (row.firstname && row.lastname && previous !== undefined) {
      issues.push({
        type: "warning",
        message: `Même nom qu'à la ligne ${previous} : vérifiez qu'il ne s'agit pas d'un doublon`,
      });
    } else {
      seen.set(key, row.line);
    }

    return { ...row, issues };
  });
};

// ---------------------------------------------------------------------------
// Noms et identifiants
// ---------------------------------------------------------------------------

// Particules qui restent en minuscules au milieu d'un nom (« Dupont de la Tour »)
const NAME_PARTICLES = new Set(["de", "du", "des", "la", "le", "les", "van", "von", "der"]);

/** « jean-PIERRE dupont DE LA tour » → « Jean-Pierre Dupont de la Tour » */
export const formatPersonName = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(
      new RegExp("(^|[\\s'’-])(\\p{L})(\\p{L}*)", "gu"),
      (_, sep: string, letter: string, rest: string, offset: number) => {
        // Une particule garde sa minuscule, sauf en tout début de nom
        if (offset > 0 && sep === " " && NAME_PARTICLES.has(letter + rest)) {
          return sep + letter + rest;
        }
        return sep + letter.toUpperCase() + rest;
      }
    );

/** Identifiant de base : initiale du prénom + nom, sans accents (« c.dupont-de-la-tour ») */
export const buildIdentifierBase = (firstname: string, lastname: string) => {
  const slug = (value: string) =>
    normalizeLabel(value)
      .replace(/['’\s]+/g, "-")
      .replace(/[^a-z-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  return `${slug(firstname).charAt(0)}.${slug(lastname)}`;
};

/**
 * Attribue un identifiant libre à chaque base : la base elle-même si elle
 * est libre, sinon base-02, base-03… Les identifiants attribués au fil de
 * la liste sont réservés, pour gérer les homonymes d'un même import.
 */
export const assignIdentifiers = (bases: string[], taken: Iterable<string>) => {
  const used = new Set(taken);
  return bases.map((base) => {
    let identifier = base;
    for (let n = 2; used.has(identifier); n++) {
      identifier = `${base}-${String(n).padStart(2, "0")}`;
    }
    used.add(identifier);
    return identifier;
  });
};

/** Contenu du modèle CSV à télécharger (séparateur « ; » comme un Excel français) */
export const IMPORT_TEMPLATE_CSV = `﻿${IMPORT_TEMPLATE_HEADERS.join(";")}\r\nLéa;Martin;CM1 Explorateurs;parent.martin@exemple.fr\r\nHugo;Bernard;CM1 Explorateurs;\r\n`;
