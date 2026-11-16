/**
 * @jest-environment node
 */
import { getLessonActivitiesAction } from "@/actions/lesson-activities.action";
import { getGroupByStudentIdData } from "@/data/group.data";
import {
  getLessonActivitiesForStudentData,
  getLessonInGroupData,
} from "@/data/lesson/lesson-activities.data";
import { currentUser } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/exercice/control-closure.data", () => ({
  closeExpiredControlsSafeData: jest.fn(),
}));
jest.mock("@/data/group.data", () => ({ getGroupByStudentIdData: jest.fn() }));
jest.mock("@/data/lesson/lesson-activities.data", () => ({
  getLessonActivitiesForStudentData: jest.fn(),
  getLessonInGroupData: jest.fn(),
}));

const mockedUser = currentUser as jest.Mock;
const mockedLesson = getLessonInGroupData as jest.Mock;
const mockedRows = getLessonActivitiesForStudentData as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT" });
  (getGroupByStudentIdData as jest.Mock).mockResolvedValue({ id: "g1" });
  mockedLesson.mockResolvedValue({ id: "l1", title: "Leçon" });
  mockedRows.mockResolvedValue([]);
});

it("refuse un professeur", async () => {
  mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });
  expect((await getLessonActivitiesAction("l1")).data).toBeNull();
  expect(mockedRows).not.toHaveBeenCalled();
});

it("refuse une leçon qui n'est pas attribuée au groupe de l'élève", async () => {
  mockedLesson.mockResolvedValue(null);
  const result = await getLessonActivitiesAction("l1");
  expect(result.error).toBeDefined();
  expect(mockedRows).not.toHaveBeenCalled();
});

it("ne cherche que les activités attribuées au groupe de l'élève", async () => {
  mockedRows.mockResolvedValue([
    {
      id: "p1",
      title: "Exercice",
      kind: "PRACTICE",
      opensAt: null,
      closesAt: null,
      level: { label: "Facile", color: "c" },
      type: { name: "Vrai ou Faux" },
      practiceAttempts: [],
      practiceCorrections: [],
      studentExercices: [],
    },
  ]);
  const result = await getLessonActivitiesAction("l1");
  expect(mockedLesson).toHaveBeenCalledWith("l1", "g1");
  expect(mockedRows).toHaveBeenCalledWith("l1", "g1", "s1");
  expect(result.data?.practices.map((p) => p.id)).toEqual(["p1"]);
});
