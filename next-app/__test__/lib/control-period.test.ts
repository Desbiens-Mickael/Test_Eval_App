import {
  areResultsVisible,
  getControlStatus,
  isControlOpen,
} from "@/lib/control-period";
import { globalExerciceSchema } from "@/shema-zod/exercice.shema";

const now = new Date("2026-11-16T12:00:00Z");
const before = new Date("2026-11-15T12:00:00Z");
const after = new Date("2026-11-17T12:00:00Z");

describe("getControlStatus", () => {
  it("sans date, le contrôle est ouvert", () => {
    expect(getControlStatus({}, now)).toBe("OPEN");
    expect(getControlStatus({ opensAt: null, closesAt: null }, now)).toBe("OPEN");
  });

  it("avant l'ouverture, le contrôle est à venir", () => {
    expect(getControlStatus({ opensAt: after }, now)).toBe("UPCOMING");
  });

  it("entre ouverture et clôture, le contrôle est ouvert", () => {
    expect(getControlStatus({ opensAt: before, closesAt: after }, now)).toBe("OPEN");
  });

  it("à la date de clôture, le contrôle est clos", () => {
    expect(getControlStatus({ closesAt: now }, now)).toBe("CLOSED");
    expect(getControlStatus({ closesAt: before }, now)).toBe("CLOSED");
  });

  it("accepte des dates sérialisées en texte", () => {
    expect(getControlStatus({ opensAt: after.toISOString() }, now)).toBe("UPCOMING");
    expect(isControlOpen({ closesAt: after.toISOString() }, now)).toBe(true);
  });
});

describe("areResultsVisible", () => {
  it("sans date de clôture, la note est visible tout de suite", () => {
    expect(areResultsVisible({ closesAt: null }, now)).toBe(true);
  });

  it("la note est cachée jusqu'à la clôture", () => {
    expect(areResultsVisible({ closesAt: after }, now)).toBe(false);
    expect(areResultsVisible({ closesAt: now }, now)).toBe(true);
  });
});

describe("validation des dates d'un contrôle", () => {
  const base = {
    title: "Contrôle",
    kind: "CONTROL" as const,
    description: "Réponds",
    exerciceTypeId: "t1",
    exerciceLevelId: "lv1",
    content: [{ question: "Le ciel est bleu", answer: true }],
  };

  it("refuse une clôture avant l'ouverture", () => {
    const result = globalExerciceSchema.safeParse({
      ...base,
      opensAt: after,
      closesAt: before,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["closesAt"]);
  });

  it("accepte une période cohérente ou sans date", () => {
    expect(
      globalExerciceSchema.safeParse({ ...base, opensAt: before, closesAt: after }).success
    ).toBe(true);
    expect(
      globalExerciceSchema.safeParse({ ...base, opensAt: null, closesAt: null }).success
    ).toBe(true);
  });

  it("ignore les dates d'un exercice (non noté)", () => {
    expect(
      globalExerciceSchema.safeParse({
        ...base,
        kind: "PRACTICE",
        opensAt: after,
        closesAt: before,
      }).success
    ).toBe(true);
  });

  it("convertit les dates reçues en texte", () => {
    const result = globalExerciceSchema.safeParse({
      ...base,
      opensAt: before.toISOString(),
      closesAt: after.toISOString(),
    });
    expect(result.success && result.data.closesAt).toEqual(after);
  });
});
