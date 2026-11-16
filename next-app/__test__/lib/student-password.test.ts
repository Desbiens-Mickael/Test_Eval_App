/**
 * @jest-environment node
 */
import { loginStudentFormSchema } from "@/shema-zod/auth.shema";
import {
  STUDENT_PASSWORD_PATTERN,
  generateStudentPassword,
} from "@/lib/student-password";

describe("generateStudentPassword", () => {
  const samples = Array.from({ length: 500 }, () => generateStudentPassword());

  it("suit le format Animal-Qualité-123", () => {
    samples.forEach((password) => expect(password).toMatch(STUDENT_PASSWORD_PATTERN));
  });

  it("ne contient ni accent ni caractère ambigu à recopier", () => {
    samples.forEach((password) => expect(password).toMatch(/^[A-Za-z0-9-]+$/));
  });

  it("est accepté par le formulaire de connexion élève", () => {
    samples.forEach((password) =>
      expect(
        loginStudentFormSchema.safeParse({ identifier: "a.b", password }).success
      ).toBe(true)
    );
  });

  it("varie d'un tirage à l'autre", () => {
    expect(new Set(samples).size).toBeGreaterThan(450);
  });
});
