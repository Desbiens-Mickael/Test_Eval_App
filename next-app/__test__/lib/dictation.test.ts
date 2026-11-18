/**
 * @jest-environment node
 */
import { alignDictation, dictationScore, dictationWords } from "@/lib/dictation";
import { gradeExercice, stripExerciceSolutions } from "@/lib/exercice-grading";
import { globalExerciceCorectionShema } from "@/shema-zod/exercice-corection.shema";
import { contentDictationShema, contentSchemaByType } from "@/shema-zod/exercice.shema";

const AUDIO = "0b9f3c3e-7f0a-4c55-9a43-2f1d8e4b6a10.webm";
const TEXT = "Le petit chat dort sur l'herbe, au soleil.";

describe("dictationWords", () => {
  it("ignore la ponctuation et garde les élisions", () => {
    expect(dictationWords(TEXT)).toEqual([
      "Le",
      "petit",
      "chat",
      "dort",
      "sur",
      "l'",
      "herbe",
      "au",
      "soleil",
    ]);
  });

  it("normalise l'apostrophe typographique", () => {
    expect(dictationWords("l’arbre qu’il voit")).toEqual(["l'", "arbre", "qu'", "il", "voit"]);
  });

  it("garde les mots composés et les nombres", () => {
    expect(dictationWords("Le grand-père a 80 ans !")).toEqual(["Le", "grand-père", "a", "80", "ans"]);
  });

  it("compare les accents sous la même forme Unicode", () => {
    // « é » décomposé (e + accent) contre « é » précomposé
    expect(dictationWords("été")).toEqual(dictationWords("été"));
  });

  it("ne trouve aucun mot dans un texte vide", () => {
    expect(dictationWords("  ... ")).toEqual([]);
  });
});

describe("alignDictation", () => {
  it("tout est juste", () => {
    const steps = alignDictation(TEXT, "Le petit chat dort sur l'herbe au soleil");
    expect(steps.every((s) => s.kind === "ok")).toBe(true);
  });

  it("repère un mot mal écrit, un mot oublié et un mot ajouté", () => {
    const steps = alignDictation(
      "Le petit chat dort au soleil",
      "Le petis chat dort bien au"
    );
    expect(steps).toEqual([
      { kind: "ok", expected: "Le", got: "Le" },
      { kind: "wrong", expected: "petit", got: "petis" },
      { kind: "ok", expected: "chat", got: "chat" },
      { kind: "ok", expected: "dort", got: "dort" },
      { kind: "extra", got: "bien" },
      { kind: "ok", expected: "au", got: "au" },
      { kind: "missing", expected: "soleil" },
    ]);
  });

  it("les accents et les majuscules comptent", () => {
    const steps = alignDictation("Élise a été", "elise a ete");
    expect(steps.map((s) => s.kind)).toEqual(["wrong", "ok", "wrong"]);
  });

  it("une copie vide oublie tous les mots", () => {
    expect(alignDictation("Le chat", "").map((s) => s.kind)).toEqual(["missing", "missing"]);
  });
});

describe("dictationScore", () => {
  it("compte les mots justes", () => {
    expect(dictationScore("Le petit chat dort au soleil", "Le petis chat dort bien au")).toEqual({
      words: 6,
      mistakes: 3,
      correct: 3,
    });
  });

  it("ne descend pas sous zéro", () => {
    expect(dictationScore("Le chat", "un deux trois quatre cinq six").correct).toBe(0);
  });
});

describe("contenu d'une dictée", () => {
  it("accepte un audio du service et un texte", () => {
    expect(contentDictationShema.safeParse({ audio: AUDIO, text: TEXT }).success).toBe(true);
    expect(contentSchemaByType["Dictée"]).toBe(contentDictationShema);
  });

  it("exige l'audio", () => {
    const result = contentDictationShema.safeParse({ audio: "", text: TEXT });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/audio/);
  });

  it("refuse un nom de fichier qui ne vient pas du service", () => {
    expect(contentDictationShema.safeParse({ audio: "../secret.webm", text: TEXT }).success).toBe(false);
    expect(
      contentDictationShema.safeParse({ audio: AUDIO.replace(".webm", ".exe"), text: TEXT }).success
    ).toBe(false);
  });

  it("exige un texte avec au moins un mot", () => {
    expect(contentDictationShema.safeParse({ audio: AUDIO, text: "" }).success).toBe(false);
    expect(contentDictationShema.safeParse({ audio: AUDIO, text: "… !" }).success).toBe(false);
  });
});

describe("note et contenu envoyé à l'élève", () => {
  const content = { audio: AUDIO, text: "Le petit chat dort au soleil" };

  it("note les mots justes sur le coefficient", () => {
    // 3 mots justes sur 6, coefficient 10
    expect(
      gradeExercice({
        type: "Dictée",
        level: "Difficile",
        content,
        response: { text: "Le petis chat dort bien au" },
      })
    ).toEqual({ note: 5, coeficient: 10 });
  });

  it("refuse une réponse d'un autre type", () => {
    expect(() =>
      gradeExercice({ type: "Dictée", level: "Facile", content, response: [{ index: 0, answer: "x" }] })
    ).toThrow();
  });

  it("n'envoie que l'audio à l'élève", () => {
    expect(stripExerciceSolutions("Dictée", content)).toEqual({ content: { audio: AUDIO, words: 6 } });
  });

  it("la réponse d'une dictée n'est pas prise pour un texte à trou", () => {
    const parsed = globalExerciceCorectionShema.parse({
      exerciceId: "ex1",
      response: { text: "Le chat" },
    });
    expect(parsed.response).toEqual({ text: "Le chat" });
  });
});
