/**
 * @jest-environment node
 */
import { summarizePractice } from "@/lib/practice";

const attempt = (note: number, iso: string) => ({ note, coeficient: 10, createdAt: new Date(iso) });

describe("summarizePractice", () => {
  it("pas encore commencé : on peut essayer, pas encore voir la correction", () => {
    expect(summarizePractice([], null)).toEqual({
      status: "not-started",
      attempts: 0,
      lastPercent: null,
      bestPercent: null,
      lastAttemptAt: null,
      correctionSeenAt: null,
      canAttempt: true,
      canRevealCorrection: false,
    });
  });

  it("en cours : dernier et meilleur essai, dans l'ordre chronologique", () => {
    const summary = summarizePractice(
      [attempt(9, "2026-11-03T10:00:00Z"), attempt(4, "2026-11-01T10:00:00Z"), attempt(6, "2026-11-05T10:00:00Z")],
      null
    );
    expect(summary).toMatchObject({
      status: "in-progress",
      attempts: 3,
      lastPercent: 60,
      bestPercent: 90,
      lastAttemptAt: "2026-11-05T10:00:00.000Z",
      canAttempt: true,
      canRevealCorrection: true,
    });
  });

  it("correction vue : plus aucun essai possible", () => {
    const summary = summarizePractice(
      [attempt(5, "2026-11-01T10:00:00Z")],
      new Date("2026-11-02T10:00:00Z")
    );
    expect(summary).toMatchObject({
      status: "correction-seen",
      correctionSeenAt: "2026-11-02T10:00:00.000Z",
      canAttempt: false,
      canRevealCorrection: false,
    });
  });
});
