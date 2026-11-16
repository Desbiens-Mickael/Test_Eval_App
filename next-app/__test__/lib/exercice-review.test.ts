/**
 * @jest-environment node
 */
import {
  TEACHER_COMMENT_MAX_LENGTH,
  buildExerciceReviewSchema,
  roundReviewNote,
} from "@/shema-zod/exercice-review.shema";

describe("buildExerciceReviewSchema", () => {
  const schema = buildExerciceReviewSchema(10);

  it("accepte une note entre 0 et le coefficient", () => {
    expect(schema.safeParse({ note: 0, comment: "" }).success).toBe(true);
    expect(schema.safeParse({ note: 10, comment: "Bravo" }).success).toBe(true);
    expect(schema.safeParse({ note: 7.5, comment: "" }).success).toBe(true);
  });

  it("convertit une note saisie en texte", () => {
    const result = schema.safeParse({ note: "8.25", comment: "" });
    expect(result.success && result.data.note).toBe(8.25);
  });

  it("refuse une note négative ou supérieure au coefficient", () => {
    expect(schema.safeParse({ note: -1, comment: "" }).success).toBe(false);
    const tooHigh = schema.safeParse({ note: 11, comment: "" });
    expect(tooHigh.success).toBe(false);
    expect(!tooHigh.success && tooHigh.error.issues[0].message).toBe(
      "La note ne peut pas dépasser 10"
    );
  });

  it("refuse une note qui n'est pas un nombre", () => {
    expect(schema.safeParse({ note: "abc", comment: "" }).success).toBe(false);
  });

  it("nettoie le commentaire et limite sa longueur", () => {
    const result = schema.safeParse({ note: 5, comment: "  Bien joué  " });
    expect(result.success && result.data.comment).toBe("Bien joué");
    expect(
      schema.safeParse({
        note: 5,
        comment: "a".repeat(TEACHER_COMMENT_MAX_LENGTH + 1),
      }).success
    ).toBe(false);
  });
});

describe("roundReviewNote", () => {
  it("arrondit au centième", () => {
    expect(roundReviewNote(3.333333)).toBe(3.33);
    expect(roundReviewNote(4)).toBe(4);
  });
});
