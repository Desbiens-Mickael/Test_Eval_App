/**
 * @jest-environment node
 */
import loginStudentAction from "@/actions/login-student.action";
import { getStudentByIdentifierlData } from "@/data/student-data";
import { verifyPassword } from "@/lib/hash-password";
import { checkLoginLock, getClientIp, recordLoginFailure } from "@/lib/login-guard";
import { signIn } from "../../auth";

jest.mock("next/headers", () => ({
  headers: () => new Headers({ "x-forwarded-for": "10.0.0.7, 172.16.0.1" }),
}));
jest.mock("../../auth", () => ({ signIn: jest.fn() }));
jest.mock("next-auth", () => ({ AuthError: class AuthError extends Error {} }));
jest.mock("@/data/student-data", () => ({
  getStudentByIdentifierlData: jest.fn(),
  UpdateStudentData: jest.fn(),
}));
jest.mock("@/lib/hash-password", () => ({ verifyPassword: jest.fn() }));
jest.mock("@/lib/login-guard", () => ({
  ...jest.requireActual("@/lib/login-guard"),
  checkLoginLock: jest.fn(),
  recordLoginFailure: jest.fn(),
}));

const mockedLock = checkLoginLock as jest.Mock;
const mockedStudent = getStudentByIdentifierlData as jest.Mock;
const mockedVerify = verifyPassword as jest.Mock;

const credentials = { identifier: "demo.hugo", password: "motdepasse" };
const attempt = { kind: "student", login: "demo.hugo", ip: "10.0.0.7" };

beforeEach(() => {
  jest.clearAllMocks();
  mockedLock.mockResolvedValue(null);
  mockedStudent.mockResolvedValue({
    id: "s1",
    identifier: "demo.hugo",
    password: "hash",
    isActive: true,
    disabledAt: null,
  });
  mockedVerify.mockResolvedValue(true);
  (signIn as jest.Mock).mockResolvedValue({});
});

it("refuse sans vérifier le mot de passe quand le compte est bloqué", async () => {
  mockedLock.mockResolvedValue("Trop de tentatives de connexion. Réessaie dans 15 minutes.");
  const result = await loginStudentAction(credentials);
  expect(result.error).toMatch(/Trop de tentatives/);
  expect(mockedLock).toHaveBeenCalledWith(attempt);
  expect(mockedVerify).not.toHaveBeenCalled();
  expect(signIn).not.toHaveBeenCalled();
});

it("compte un mauvais mot de passe", async () => {
  mockedVerify.mockResolvedValue(false);
  const result = await loginStudentAction(credentials);
  expect(result.error).toBe("Identifiant ou mot de passe invalide !");
  expect(recordLoginFailure).toHaveBeenCalledWith(attempt);
});

it("compte un identifiant inconnu, avec le même message", async () => {
  mockedStudent.mockResolvedValue(null);
  const result = await loginStudentAction(credentials);
  expect(result.error).toBe("Identifiant ou mot de passe invalide !");
  expect(recordLoginFailure).toHaveBeenCalledWith(attempt);
});

it("laisse passer une connexion correcte", async () => {
  const result = await loginStudentAction(credentials);
  expect(result).toEqual({ redirect: true });
  expect(recordLoginFailure).not.toHaveBeenCalled();
});

describe("getClientIp", () => {
  it("prend la première adresse transmise par le proxy", () => {
    expect(getClientIp(new Headers({ "x-forwarded-for": " 1.1.1.1 , 2.2.2.2" }))).toBe("1.1.1.1");
    expect(getClientIp(new Headers({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(getClientIp(new Headers())).toBeNull();
  });
});
