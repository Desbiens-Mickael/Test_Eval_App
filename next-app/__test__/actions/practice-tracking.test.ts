/**
 * @jest-environment node
 */
import { getStudentPracticeTrackingAction } from "@/actions/practice-tracking.action";
import { getStudentPracticeTrackingData } from "@/data/exercice/practice-data";
import { currentUser } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/exercice/practice-data", () => ({ getStudentPracticeTrackingData: jest.fn() }));

const mockedUser = currentUser as jest.Mock;
const mockedData = getStudentPracticeTrackingData as jest.Mock;

beforeEach(() => {
  mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });
  mockedData.mockResolvedValue([
    {
      id: "e1",
      title: "Pythagore",
      lesson: { LessonSubject: { label: "Mathématique", color: "bg-green-500" } },
      type: { name: "Vrai ou Faux" },
      practiceAttempts: [
        { note: 2.5, coeficient: 5, createdAt: new Date("2026-11-01T10:00:00Z") },
        { note: 5, coeficient: 5, createdAt: new Date("2026-11-02T10:00:00Z") },
      ],
      practiceCorrections: [{ revealedAt: new Date("2026-11-03T10:00:00Z") }],
    },
  ]);
});

describe("getStudentPracticeTrackingAction", () => {
  it("renvoie la courbe des essais au professeur de l'élève", async () => {
    const result = await getStudentPracticeTrackingAction("s1");
    expect(mockedData).toHaveBeenCalledWith("s1", "t1");
    expect(result.data?.exercises[0]).toMatchObject({
      title: "Pythagore",
      status: "correction-seen",
      attempts: [
        { n: 1, percent: 50 },
        { n: 2, percent: 100 },
      ],
      progress: 50,
    });
  });

  it("refuse l'élève d'un autre professeur", async () => {
    mockedData.mockResolvedValue(null);
    const result = await getStudentPracticeTrackingAction("s1");
    expect(result).toEqual({ error: "Élève non trouvé", data: null });
  });

  it("refuse un élève ou un visiteur", async () => {
    mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT" });
    expect((await getStudentPracticeTrackingAction("s1")).error).toBe("Action non autorisée !");
    mockedUser.mockResolvedValue(undefined);
    expect((await getStudentPracticeTrackingAction("s1")).error).toBe("Action non autorisée !");
    expect(mockedData).not.toHaveBeenCalled();
  });
});
