/**
 * @jest-environment node
 */
import { GET } from "@/app/api/notifications/stream/route";
import {
  createStudentNotificationData,
  createTeacherNotificationData,
} from "@/data/notification/notification.data";
import { currentUser } from "@/lib/auth";
import { listenerCount, publishNotification } from "@/lib/notification-hub";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/exercice/control-closure.data", () => ({ closeExpiredControlsSafeData: jest.fn() }));
jest.mock("@/lib/db", () => ({
  prisma: {
    studentNotification: { createMany: jest.fn() },
    teacherNotification: { create: jest.fn() },
  },
}));

const mockedUser = currentUser as jest.Mock;

/** Lit le flux jusqu'à trouver `text` */
const readUntil = async (reader: ReadableStreamDefaultReader<Uint8Array>, text: string) => {
  const decoder = new TextDecoder();
  let received = "";
  while (!received.includes(text)) {
    const { value, done } = await reader.read();
    if (done) break;
    received += decoder.decode(value);
  }
  return received;
};

const open = async () => {
  const controller = new AbortController();
  const response = await GET(
    new Request("http://localhost/api/notifications/stream", { signal: controller.signal })
  );
  return { response, controller };
};

beforeEach(() => jest.clearAllMocks());

it("refuse un visiteur non connecté", async () => {
  mockedUser.mockResolvedValue(undefined);
  const { response } = await open();
  expect(response.status).toBe(401);
});

it("envoie un événement à l'élève notifié, puis se nettoie à la déconnexion", async () => {
  mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT" });
  const { response, controller } = await open();
  expect(response.headers.get("Content-Type")).toContain("text/event-stream");

  const reader = response.body!.getReader();
  expect(await readUntil(reader, "event: ready")).toContain("retry: 5000");
  expect(listenerCount({ kind: "student", id: "s1" })).toBe(1);

  await createStudentNotificationData("n1", [{ id: "s1" }, { id: "s2" }]);
  expect(await readUntil(reader, "event: notification")).toContain("event: notification");

  controller.abort();
  expect(listenerCount({ kind: "student", id: "s1" })).toBe(0);
});

it("le professeur ne reçoit que les notifications qui lui sont destinées", async () => {
  mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });
  const { response, controller } = await open();
  const reader = response.body!.getReader();
  await readUntil(reader, "event: ready");

  // Notification d'un autre professeur : rien ; la sienne : un événement
  publishNotification([{ kind: "teacher", id: "t2" }]);
  await createTeacherNotificationData("n2", "t1");
  const received = await readUntil(reader, "event: notification");
  expect(received.match(/event: notification/g)).toHaveLength(1);
  controller.abort();
});
