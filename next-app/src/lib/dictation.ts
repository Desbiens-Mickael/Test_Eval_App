// Correction d'une dictée, mot à mot. Fonctions pures, utilisables côté
// serveur (note) comme côté navigateur (affichage de la correction).
//
// Règles :
// - les accents et les majuscules comptent, comme dans une dictée en classe ;
// - la ponctuation n'est pas notée ;
// - une élision reste attachée à son mot (« l' », « qu' ») ;
// - un mot faux, oublié ou ajouté compte pour une faute.

export type DictationStep =
  | { kind: "ok"; expected: string; got: string }
  | { kind: "wrong"; expected: string; got: string }
  | { kind: "missing"; expected: string }
  | { kind: "extra"; got: string };

// Un mot : lettres et chiffres, avec traits d'union internes, suivi
// éventuellement d'une apostrophe d'élision
// (constructeur RegExp : le drapeau « u » n'est pas accepté en littéral par la cible TS)
const WORD = new RegExp("[\\p{L}\\p{N}]+(?:-[\\p{L}\\p{N}]+)*'?", "gu");

/** Découpe un texte en mots (apostrophes typographiques normalisées) */
export const dictationWords = (text: string): string[] =>
  text
    .normalize("NFC")
    .replace(/[’‘ʼ`´]/g, "'")
    .match(WORD) ?? [];

/**
 * Aligne la copie de l'élève sur le texte attendu (distance d'édition entre
 * les suites de mots) et renvoie chaque étape, dans l'ordre du texte.
 */
export const alignDictation = (expectedText: string, answerText: string): DictationStep[] => {
  const expected = dictationWords(expectedText);
  const got = dictationWords(answerText);
  const n = expected.length;
  const m = got.length;

  // Pour chaque case : fautes minimales pour aligner les i premiers mots
  // attendus sur les j premiers écrits ; à fautes égales, le plus de mots
  // justes face à face (la correction affichée est alors plus parlante).
  // move[i][j] retient le chemin choisi pour la remontée.
  type Cell = { mistakes: number; matches: number };
  const better = (a: Cell, b: Cell) =>
    a.mistakes < b.mistakes || (a.mistakes === b.mistakes && a.matches > b.matches);
  const best: Cell[][] = [];
  const move: ("diag" | "up" | "left")[][] = [];
  for (let i = 0; i <= n; i++) {
    best.push([]);
    move.push([]);
    for (let j = 0; j <= m; j++) {
      if (i === 0 && j === 0) {
        best[i].push({ mistakes: 0, matches: 0 });
        move[i].push("diag");
        continue;
      }
      let choice: Cell | null = null;
      let from: "diag" | "up" | "left" = "diag";
      if (i > 0 && j > 0) {
        const same = expected[i - 1] === got[j - 1];
        const prev = best[i - 1][j - 1];
        choice = { mistakes: prev.mistakes + (same ? 0 : 1), matches: prev.matches + (same ? 1 : 0) };
      }
      if (i > 0) {
        const prev = best[i - 1][j];
        const candidate = { mistakes: prev.mistakes + 1, matches: prev.matches };
        if (!choice || better(candidate, choice)) {
          choice = candidate;
          from = "up";
        }
      }
      if (j > 0) {
        const prev = best[i][j - 1];
        const candidate = { mistakes: prev.mistakes + 1, matches: prev.matches };
        if (!choice || better(candidate, choice)) {
          choice = candidate;
          from = "left";
        }
      }
      best[i].push(choice as Cell);
      move[i].push(from);
    }
  }

  const steps: DictationStep[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    const from = move[i][j];
    if (from === "diag") {
      steps.push(
        expected[i - 1] === got[j - 1]
          ? { kind: "ok", expected: expected[i - 1], got: got[j - 1] }
          : { kind: "wrong", expected: expected[i - 1], got: got[j - 1] }
      );
      i--;
      j--;
    } else if (from === "up") {
      steps.push({ kind: "missing", expected: expected[i - 1] });
      i--;
    } else {
      steps.push({ kind: "extra", got: got[j - 1] });
      j--;
    }
  }
  return steps.reverse();
};

/** Nombre de mots attendus et de fautes ; la note compte les mots justes */
export const dictationScore = (expectedText: string, answerText: string) => {
  const steps = alignDictation(expectedText, answerText);
  const words = dictationWords(expectedText).length;
  const mistakes = steps.filter((s) => s.kind !== "ok").length;
  return { words, mistakes, correct: Math.max(0, words - mistakes) };
};
