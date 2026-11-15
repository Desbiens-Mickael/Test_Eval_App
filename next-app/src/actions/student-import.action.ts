"use server";

import { getGroupsByAuthorIdData } from "@/data/group.data";
import {
  createStudentsData,
  getTakenIdentifiersData,
} from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import { hashPassword } from "@/lib/hash-password";
import { sendImportedStudentsCredentialsEmail } from "@/lib/mail";
import {
  ImportRow,
  MAX_IMPORT_ROWS,
  assignIdentifiers,
  buildIdentifierBase,
  checkImportRows,
  formatPersonName,
  normalizeLabel,
} from "@/lib/student-import";
import { generateStudentPassword } from "@/lib/student-password";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const importRowsSchema = z
  .array(
    z.object({
      line: z.number().int().positive(),
      firstname: z.string().trim(),
      lastname: z.string().trim(),
      group: z.string().trim().max(50),
    })
  )
  .min(1, "Aucun élève à importer.")
  .max(MAX_IMPORT_ROWS, `L'import est limité à ${MAX_IMPORT_ROWS} élèves à la fois.`);

export type ImportedStudent = {
  name: string;
  identifier: string;
  password: string;
  group: string | null;
};

/**
 * Crée les comptes des élèves importés (fichier CSV / Excel ou copier-coller).
 * Les lignes sont revérifiées ici : le navigateur n'est jamais cru sur parole.
 * Les mots de passe sont renvoyés une seule fois et envoyés par email au professeur.
 */
export const importStudentsAction = async (input: ImportRow[]) => {
  const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  const parsed = importRowsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données non valide !" };
  }

  const groups = await getGroupsByAuthorIdData(user.id);
  const checked = checkImportRows(
    parsed.data,
    groups.map((g) => g.name)
  );
  const invalid = checked.filter((row) => row.issues.some((i) => i.type === "error"));
  if (invalid.length > 0) {
    return {
      error: `${invalid.length} ligne${invalid.length > 1 ? "s contiennent" : " contient"} des erreurs (ligne ${invalid
        .map((r) => r.line)
        .join(", ")}). Corrigez-les avant d'importer.`,
    };
  }

  const groupByName = new Map(groups.map((g) => [normalizeLabel(g.name), g]));
  const bases = checked.map((r) => buildIdentifierBase(r.firstname, r.lastname));
  if (bases.some((base) => !/^[a-z]\.[a-z]/.test(base))) {
    return { error: "Impossible de créer un identifiant pour certains élèves." };
  }

  try {
    const identifiers = assignIdentifiers(bases, await getTakenIdentifiersData(bases));

    const students: ImportedStudent[] = checked.map((row, i) => ({
      name: `${formatPersonName(row.firstname)} ${formatPersonName(row.lastname)}`,
      identifier: identifiers[i],
      password: generateStudentPassword(),
      group: groupByName.get(normalizeLabel(row.group))?.name ?? null,
    }));

    const hashed = await Promise.all(students.map((s) => hashPassword(s.password)));
    await createStudentsData(
      students.map((s, i) => ({
        name: s.name,
        identifier: s.identifier,
        password: hashed[i],
        professorId: user.id as string,
        groupId: s.group ? groupByName.get(normalizeLabel(s.group))?.id ?? null : null,
      }))
    );

    let emailSent = false;
    if (user.email) {
      try {
        await sendImportedStudentsCredentialsEmail(user.email, students);
        emailSent = true;
      } catch (error) {
        console.error("Error sending imported students email:", error);
      }
    }

    return {
      success: `${students.length} élève${students.length > 1 ? "s ont été créés" : " a été créé"}.`,
      data: { students, emailSent },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: "Un identifiant vient d'être pris par un autre compte. Relancez l'import.",
      };
    }
    console.error("Error importing students:", error);
    return { error: "Une erreur est survenue pendant l'import. Aucun élève n'a été créé." };
  }
};
