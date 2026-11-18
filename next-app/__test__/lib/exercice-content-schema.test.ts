/**
 * @jest-environment node
 */
import {
  contentMatchingPairsShema,
  contentOrderingShema,
  contentSchemaByType,
  globalExerciceSchema,
} from "@/shema-zod/exercice.shema";

const base = {
  title: "Titre",
  kind: "PRACTICE" as const,
  description: "Description",
  exerciceTypeId: "t1",
  exerciceLevelId: "l1",
  opensAt: null,
  closesAt: null,
};

describe("Associer par paires", () => {
  it("accepte au moins deux paires complètes", () => {
    expect(
      contentMatchingPairsShema.safeParse([
        { left: "Chat", right: "Miaule" },
        { left: "Chien", right: "Aboie" },
      ]).success
    ).toBe(true);
  });

  it("refuse une seule paire", () => {
    const result = contentMatchingPairsShema.safeParse([{ left: "Chat", right: "Miaule" }]);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/au moins deux paires/);
  });

  it("refuse une paire incomplète, même remplie d'espaces", () => {
    expect(
      contentMatchingPairsShema.safeParse([
        { left: "Chat", right: "   " },
        { left: "Chien", right: "Aboie" },
      ]).success
    ).toBe(false);
  });
});

describe("Remettre dans l'ordre", () => {
  it("accepte une liste d'au moins deux éléments différents", () => {
    expect(
      contentOrderingShema.safeParse([{ instruction: "Ordre", items: ["A", "B"] }]).success
    ).toBe(true);
  });

  it("refuse une liste d'un seul élément", () => {
    expect(contentOrderingShema.safeParse([{ instruction: "Ordre", items: ["A"] }]).success).toBe(false);
  });

  it("refuse une liste dont tous les éléments sont identiques", () => {
    const result = contentOrderingShema.safeParse([{ instruction: "Ordre", items: ["A", " A "] }]);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/différents/);
  });

  it("refuse une consigne vide", () => {
    expect(contentOrderingShema.safeParse([{ instruction: "", items: ["A", "B"] }]).success).toBe(false);
  });
});

describe("schéma global", () => {
  it.each([
    ["Associer par paires", [{ left: "A", right: "1" }, { left: "B", right: "2" }]],
    ["Remettre dans l'ordre", [{ instruction: "Ordre", items: ["A", "B"] }]],
  ])("accepte le contenu « %s »", (_, content) => {
    expect(globalExerciceSchema.safeParse({ ...base, content }).success).toBe(true);
  });

  it("chaque type a son schéma de contenu", () => {
    expect(Object.keys(contentSchemaByType).sort()).toEqual(
      [
        "Associer par paires",
        "Carte",
        "Choix multiple",
        "Remettre dans l'ordre",
        "Texte à trou",
        "Vrai ou Faux",
      ].sort()
    );
  });

  it("le schéma d'un type refuse le contenu d'un autre type", () => {
    const pairs = [{ left: "A", right: "1" }, { left: "B", right: "2" }];
    expect(contentSchemaByType["Vrai ou Faux"].safeParse(pairs).success).toBe(false);
    expect(contentSchemaByType["Associer par paires"].safeParse(pairs).success).toBe(true);
  });
});
