/**
 * @jest-environment node
 */
import { closeExpiredControlsData } from "@/data/exercice/control-closure.data";
import { prisma } from "@/lib/db";

jest.mock("@/lib/db", () => {
  const tx = {
    exercice: { updateMany: jest.fn(), findUniqueOrThrow: jest.fn() },
    student: { findMany: jest.fn() },
    studentExercice: { findMany: jest.fn(), createMany: jest.fn() },
    notification: { create: jest.fn() },
    studentNotification: { createMany: jest.fn() },
  };
  return {
    prisma: {
      exercice: { findMany: jest.fn() },
      $transaction: jest.fn((fn: (t: typeof tx) => unknown) => fn(tx)),
      __tx: tx,
    },
  };
});

type Tx = {
  exercice: { updateMany: jest.Mock; findUniqueOrThrow: jest.Mock };
  student: { findMany: jest.Mock };
  studentExercice: { findMany: jest.Mock; createMany: jest.Mock };
  notification: { create: jest.Mock };
  studentNotification: { createMany: jest.Mock };
};
const db = prisma as unknown as { exercice: { findMany: jest.Mock }; __tx: Tx };
const tx = db.__tx;
const now = new Date("2026-11-16T12:00:00Z");

beforeEach(() => {
  jest.clearAllMocks();
  db.exercice.findMany.mockResolvedValue([{ id: "ex1" }]);
  tx.exercice.updateMany.mockResolvedValue({ count: 1 });
  tx.exercice.findUniqueOrThrow.mockResolvedValue({
    id: "ex1",
    title: "Les fractions",
    authorId: "t1",
    level: { label: "Difficile" },
    lesson: { LessonSubject: { label: "Mathématiques" } },
    groups: [{ id: "g1" }],
  });
  tx.student.findMany.mockResolvedValue([{ id: "s1" }, { id: "s2" }, { id: "s3" }]);
  tx.studentExercice.findMany.mockResolvedValue([{ studentId: "s1" }]);
  tx.notification.create.mockResolvedValue({ id: "n1" });
});

it("note 0 les copies non rendues et notifie tous les élèves", async () => {
  expect(await closeExpiredControlsData(now)).toBe(1);

  // Seuls les contrôles expirés et pas encore clos sont cherchés
  expect(db.exercice.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { kind: "CONTROL", closedAt: null, closesAt: { lte: now } },
    })
  );
  // Les élèves désactivés ne sont pas concernés
  expect(tx.student.findMany).toHaveBeenCalledWith(
    expect.objectContaining({ where: { groupId: { in: ["g1"] }, disabledAt: null } })
  );

  const { data } = tx.studentExercice.createMany.mock.calls[0][0];
  expect(data.map((d: { studentId: string }) => d.studentId)).toEqual(["s2", "s3"]);
  expect(data[0]).toMatchObject({
    exerciceId: "ex1",
    subject: "Mathématiques",
    note: 0,
    autoNote: 0,
    coeficient: 10,
    isMissing: true,
  });

  expect(tx.notification.create).toHaveBeenCalledWith({
    data: expect.objectContaining({ type: "RESULTS", exerciseId: "ex1" }),
  });
  const notified = tx.studentNotification.createMany.mock.calls[0][0].data;
  expect(notified.map((n: { studentId: string }) => n.studentId)).toEqual(["s1", "s2", "s3"]);
});

it("ne traite pas deux fois un contrôle déjà clos", async () => {
  tx.exercice.updateMany.mockResolvedValue({ count: 0 });
  expect(await closeExpiredControlsData(now)).toBe(0);
  expect(tx.studentExercice.createMany).not.toHaveBeenCalled();
  expect(tx.notification.create).not.toHaveBeenCalled();
});

it("ne crée aucune copie si tous les élèves ont rendu", async () => {
  tx.studentExercice.findMany.mockResolvedValue([
    { studentId: "s1" },
    { studentId: "s2" },
    { studentId: "s3" },
  ]);
  await closeExpiredControlsData(now);
  expect(tx.studentExercice.createMany).not.toHaveBeenCalled();
  expect(tx.notification.create).toHaveBeenCalled();
});
