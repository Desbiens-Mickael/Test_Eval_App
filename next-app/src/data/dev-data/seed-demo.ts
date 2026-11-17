/**
 * Données de démonstration pour le tableau de bord professeur.
 *
 * À lancer APRÈS le seed de base (`npm run resetDB`) :
 *   npm run seedDemo
 *
 * Ajoute au professeur de démo : 3 groupes, 18 élèves aux profils variés
 * (à l'aise, en difficulté, en baisse, inactif), 12 exercices complets et
 * environ 150 copies réparties sur 100 jours, à des heures réalistes.
 * Le script est rejouable : il supprime d'abord ce qu'il a créé.
 */
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";
import { calculateNote } from "@/lib/utils";
import { randomUUID } from "crypto";

const TEACHER_EMAIL = "admin@gmail.com";
const DEMO_PASSWORD = "azerty22";
const DAY_MS = 24 * 60 * 60 * 1000;

// Générateur pseudo-aléatoire déterministe : la démo est identique à chaque fois
let seedState = 20261112;
const random = () => {
  seedState = (seedState * 1664525 + 1013904223) % 4294967296;
  return seedState / 4294967296;
};
const pick = <T>(items: T[]) => items[Math.floor(random() * items.length)];
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------------------
// Exercices
// ---------------------------------------------------------------------------

type Card = { id: string; content: string };
const cards = (...labels: string[]): Card[] =>
  labels.map((content) => ({ id: randomUUID(), content }));

type ExerciseDef = {
  title: string;
  description: string;
  subject: "Mathématique" | "Français" | "Histoire" | "Physique";
  level: "Facile" | "Difficile" | "Très difficile";
  /** Difficulté supplémentaire propre à l'exercice (0 à 0,3) */
  extra: number;
} & (
  | { type: "Choix multiple"; content: { question: string; answers: { answer: string; isCorrect: boolean }[] }[] }
  | { type: "Vrai ou Faux"; content: { question: string; answer: boolean }[] }
  | {
      type: "Texte à trou";
      content: {
        text: string[];
        answers: { answer: string; placeholder: string; position: number }[];
      };
      distractors: string[];
    }
  | { type: "Carte"; content: { column: string; cards: Card[] }[] }
);

const gapFill = (sentence: string, blanks: string[]) => {
  // Même format que l'éditeur du professeur : les espaces sont des éléments à part
  const text = sentence.split(/(\s+)/);
  return {
    text,
    answers: blanks.map((word) => {
      const position = text.indexOf(word);
      if (position === -1) throw new Error(`Mot absent : ${word}`);
      return { answer: word, placeholder: "_".repeat(Math.max(4, word.length)), position };
    }),
  };
};

const EXERCISES: ExerciseDef[] = [
  {
    title: "Les triangles rectangles",
    description: "Reconnais les propriétés d'un triangle rectangle.",
    subject: "Mathématique",
    level: "Facile",
    extra: 0,
    type: "Choix multiple",
    content: [
      {
        question: "Combien d'angles droits a un triangle rectangle ?",
        answers: [
          { answer: "Un", isCorrect: true },
          { answer: "Deux", isCorrect: false },
          { answer: "Trois", isCorrect: false },
        ],
      },
      {
        question: "Comment s'appelle le plus grand côté ?",
        answers: [
          { answer: "L'hypoténuse", isCorrect: true },
          { answer: "La base", isCorrect: false },
          { answer: "La médiane", isCorrect: false },
        ],
      },
      {
        question: "Quels triangles peuvent être rectangles ?",
        answers: [
          { answer: "Un triangle isocèle", isCorrect: true },
          { answer: "Un triangle équilatéral", isCorrect: false },
          { answer: "Un triangle quelconque", isCorrect: true },
        ],
      },
      {
        question: "Que vaut la somme des angles d'un triangle ?",
        answers: [
          { answer: "90°", isCorrect: false },
          { answer: "180°", isCorrect: true },
          { answer: "360°", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "Vrai ou faux : Pythagore",
    description: "Vérifie que tu as compris le théorème de Pythagore.",
    subject: "Mathématique",
    level: "Difficile",
    extra: 0.05,
    type: "Vrai ou Faux",
    content: [
      { question: "Le théorème ne s'applique qu'aux triangles rectangles.", answer: true },
      { question: "Dans un triangle 3-4-5, l'hypoténuse mesure 4.", answer: false },
      { question: "a² + b² = c², où c est l'hypoténuse.", answer: true },
      { question: "Pythagore était un mathématicien romain.", answer: false },
      { question: "Un triangle 6-8-10 est rectangle.", answer: true },
      { question: "L'hypoténuse peut être plus petite qu'un autre côté.", answer: false },
    ],
  },
  {
    title: "Calcul de l'hypoténuse",
    description: "Calcule la longueur de l'hypoténuse.",
    subject: "Mathématique",
    level: "Très difficile",
    extra: 0.3,
    type: "Choix multiple",
    content: [
      {
        question: "Côtés de 5 et 12 : combien mesure l'hypoténuse ?",
        answers: [
          { answer: "13", isCorrect: true },
          { answer: "17", isCorrect: false },
          { answer: "15", isCorrect: false },
        ],
      },
      {
        question: "Côtés de 9 et 12 : combien mesure l'hypoténuse ?",
        answers: [
          { answer: "21", isCorrect: false },
          { answer: "15", isCorrect: true },
          { answer: "14", isCorrect: false },
        ],
      },
      {
        question: "Hypoténuse de 25 et un côté de 7 : combien mesure l'autre côté ?",
        answers: [
          { answer: "18", isCorrect: false },
          { answer: "24", isCorrect: true },
          { answer: "32", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "Le vocabulaire des triangles",
    description: "Range chaque mot dans la bonne famille de triangle.",
    subject: "Mathématique",
    level: "Facile",
    extra: 0,
    type: "Carte",
    content: [
      { column: "Triangle rectangle", cards: cards("Angle droit", "Hypoténuse", "Pythagore") },
      { column: "Triangle équilatéral", cards: cards("Trois côtés égaux", "Angles de 60°", "Trois axes de symétrie") },
    ],
  },
  {
    title: "Conjugue au présent",
    description: "Complète avec le verbe conjugué au présent.",
    subject: "Français",
    level: "Facile",
    extra: 0,
    type: "Texte à trou",
    content: gapFill(
      "Chaque matin je prends le bus, tu vas à pied et nous faisons la course avant que vous veniez nous chercher, puis ils disent bonjour",
      ["prends", "vas", "faisons", "veniez", "disent"]
    ),
    distractors: ["prend", "va", "faison", "venez", "dient"],
  },
  {
    title: "Le passé composé",
    description: "Complète avec le participe passé.",
    subject: "Français",
    level: "Difficile",
    extra: 0.1,
    type: "Texte à trou",
    content: gapFill(
      "Hier nous avons pris le train, elle a fait un gâteau, ils ont vu un film et j'ai mis mon manteau",
      ["pris", "fait", "vu", "mis"]
    ),
    distractors: ["prit", "faite", "vus", "mit"],
  },
  {
    title: "Classe les verbes",
    description: "Range chaque verbe dans son groupe.",
    subject: "Français",
    level: "Difficile",
    extra: 0.08,
    type: "Carte",
    content: [
      { column: "1er groupe", cards: cards("Chanter", "Jouer", "Manger") },
      { column: "2e groupe", cards: cards("Finir", "Grandir", "Choisir") },
      { column: "3e groupe", cards: cards("Prendre", "Venir", "Voir") },
    ],
  },
  {
    title: "Vrai ou faux : conjugaison",
    description: "Ces phrases sont-elles bien conjuguées ?",
    subject: "Français",
    level: "Facile",
    extra: 0,
    type: "Vrai ou Faux",
    content: [
      { question: "« Nous faisons nos devoirs. »", answer: true },
      { question: "« Vous disez la vérité. »", answer: false },
      { question: "« Ils vont à l'école. »", answer: true },
      { question: "« Je peut venir. »", answer: false },
      { question: "« Tu prends ton goûter. »", answer: true },
    ],
  },
  {
    title: "Les grandes dates",
    description: "Teste tes connaissances sur la Seconde Guerre mondiale.",
    subject: "Histoire",
    level: "Difficile",
    extra: 0.05,
    type: "Vrai ou Faux",
    content: [
      { question: "La guerre commence en 1939.", answer: true },
      { question: "Le débarquement de Normandie a lieu en 1940.", answer: false },
      { question: "La guerre se termine en Europe le 8 mai 1945.", answer: true },
      { question: "Paris est libérée en 1944.", answer: true },
      { question: "La guerre dure dix ans.", answer: false },
    ],
  },
  {
    title: "Avant ou après 1945 ?",
    description: "Place chaque événement avant ou après la fin de la guerre.",
    subject: "Histoire",
    level: "Très difficile",
    extra: 0.15,
    type: "Carte",
    content: [
      { column: "Avant 1945", cards: cards("Appel du 18 juin", "Débarquement en Normandie", "Libération de Paris") },
      { column: "Après 1945", cards: cards("Création de l'ONU", "Premier homme sur la Lune", "Chute du mur de Berlin") },
    ],
  },
  {
    title: "L'énergie des étoiles",
    description: "Comprendre d'où vient l'énergie du Soleil.",
    subject: "Physique",
    level: "Difficile",
    extra: 0.08,
    type: "Choix multiple",
    content: [
      {
        question: "D'où vient l'énergie du Soleil ?",
        answers: [
          { answer: "De la fusion nucléaire", isCorrect: true },
          { answer: "D'un feu de charbon", isCorrect: false },
          { answer: "De l'électricité", isCorrect: false },
        ],
      },
      {
        question: "Quels atomes fusionnent dans le Soleil ?",
        answers: [
          { answer: "Des atomes d'hydrogène", isCorrect: true },
          { answer: "Des atomes de fer", isCorrect: false },
          { answer: "Des atomes d'or", isCorrect: false },
        ],
      },
      {
        question: "Qu'est-ce que la fusion produit ?",
        answers: [
          { answer: "De la lumière", isCorrect: true },
          { answer: "De la chaleur", isCorrect: true },
          { answer: "Du froid", isCorrect: false },
        ],
      },
      {
        question: "La fusion a besoin…",
        answers: [
          { answer: "d'une température très élevée", isCorrect: true },
          { answer: "d'eau glacée", isCorrect: false },
          { answer: "du vide absolu", isCorrect: false },
        ],
      },
    ],
  },
  {
    title: "Fusion ou fission ?",
    description: "Range chaque phrase dans la bonne réaction.",
    subject: "Physique",
    level: "Difficile",
    extra: 0.12,
    type: "Carte",
    content: [
      { column: "Fusion", cards: cards("Les atomes s'unissent", "Se produit dans les étoiles", "Utilise de l'hydrogène") },
      { column: "Fission", cards: cards("Un atome se casse", "Utilisée dans les centrales", "Utilise de l'uranium") },
    ],
  },
];

const LEVEL_DIFFICULTY = { Facile: 0, Difficile: 0.12, "Très difficile": 0.25 };

/** Nombre d'éléments notés dans un exercice */
const itemCount = (e: ExerciseDef) => {
  switch (e.type) {
    case "Carte":
      return e.content.reduce((sum, col) => sum + col.cards.length, 0);
    case "Texte à trou":
      return e.content.answers.length;
    default:
      return e.content.length;
  }
};

/** Construit une réponse d'élève avec exactement `correct` bonnes réponses */
const buildResponse = (e: ExerciseDef, correct: number) => {
  const n = itemCount(e);
  const indices = Array.from({ length: n }, (_, i) => i).sort(() => random() - 0.5);
  const good = new Set(indices.slice(0, correct));

  switch (e.type) {
    case "Vrai ou Faux":
      return e.content.map((q, index) => ({
        index,
        answer: good.has(index) ? q.answer : !q.answer,
      }));
    case "Choix multiple":
      return e.content.map((q, questionIndex) => {
        const right = q.answers.flatMap((a, i) => (a.isCorrect ? [i] : []));
        const wrong = q.answers.flatMap((a, i) => (a.isCorrect ? [] : [i]));
        return {
          questionIndex,
          selectedAnswers: good.has(questionIndex) ? right : [pick(wrong)],
        };
      });
    case "Texte à trou":
      return Object.fromEntries(
        e.content.answers.map((a, i) => [
          a.position,
          good.has(i) ? a.answer : e.distractors[i],
        ])
      );
    case "Carte": {
      const flat = e.content.flatMap((col, c) => col.cards.map((card) => ({ card, c })));
      const placed = e.content.map((col) => ({ column: col.column, cards: [] as Card[] }));
      flat.forEach(({ card, c }, i) => {
        const target = good.has(i) ? c : (c + 1) % e.content.length;
        placed[target].cards.push(card);
      });
      return placed;
    }
  }
};

// ---------------------------------------------------------------------------
// Classes et élèves
// ---------------------------------------------------------------------------

type Profile = "fort" | "moyen" | "fragile" | "en-baisse" | "inactif";
const ABILITY: Record<Profile, number> = {
  fort: 0.97,
  moyen: 0.84,
  fragile: 0.48,
  "en-baisse": 0.9,
  inactif: 0.72,
};

const GROUPS: {
  name: string;
  exercises: number[];
  students: [string, Profile][];
}[] = [
  {
    name: "CM1 Explorateurs",
    exercises: [0, 1, 3, 4, 6, 7, 8, 10],
    students: [
      ["Léa Martin", "fort"],
      ["Hugo Bernard", "moyen"],
      ["Inès Petit", "moyen"],
      ["Nathan Robert", "fragile"],
      ["Chloé Richard", "fort"],
      ["Adam Durand", "en-baisse"],
    ],
  },
  {
    name: "CM2 Inventeurs",
    exercises: [0, 1, 2, 4, 5, 6, 8, 9, 10, 11],
    students: [
      ["Emma Dubois", "fort"],
      ["Louis Moreau", "moyen"],
      ["Jade Laurent", "moyen"],
      ["Gabriel Simon", "fragile"],
      ["Manon Michel", "moyen"],
      ["Raphaël Lefebvre", "inactif"],
    ],
  },
  {
    name: "CE2 Curieux",
    exercises: [0, 3, 4, 7, 11],
    students: [
      ["Alice Leroy", "moyen"],
      ["Lucas Roux", "fort"],
      ["Rose David", "fragile"],
      ["Arthur Bertrand", "moyen"],
      ["Mila Morel", "moyen"],
      ["Jules Fournier", "en-baisse"],
    ],
  },
];

// Jour de publication de chaque exercice (jours avant aujourd'hui)
const PUBLISHED_DAYS_AGO = [96, 84, 70, 62, 52, 44, 35, 27, 20, 13, 8, 4];

/** Heure de rendu réaliste (heure de Paris) selon le jour de la semaine */
const submissionDate = (day: Date) => {
  const weekday = (day.getUTCDay() + 6) % 7; // lundi = 0
  let hour: number;
  if (weekday === 2) hour = pick([10, 14, 14, 15, 15, 16, 17]); // mercredi après-midi
  else if (weekday >= 5) hour = pick([9, 10, 10, 11, 15, 18]); // week-end
  else hour = pick([7, 16, 17, 17, 18, 18, 19, 20, 21]); // après l'école
  const date = new Date(day);
  // Heure d'hiver à Paris : UTC + 1
  date.setUTCHours(hour - 1, Math.floor(random() * 60), 0, 0);
  return date;
};

const main = async () => {
  const teacher = await prisma.user.findUnique({ where: { email: TEACHER_EMAIL } });
  if (!teacher) throw new Error(`Professeur ${TEACHER_EMAIL} introuvable : lancez d'abord npm run resetDB`);

  const [levels, types, lessons] = await Promise.all([
    prisma.exerciceLevel.findMany(),
    prisma.exerciceType.findMany(),
    prisma.lesson.findMany({ where: { authorId: teacher.id }, include: { LessonSubject: true } }),
  ]);
  const idOf = <T extends { id: string }>(items: T[], match: (item: T) => boolean, what: string) => {
    const found = items.find(match);
    if (!found) throw new Error(`Introuvable : ${what}`);
    return found.id;
  };

  // --- Nettoyage d'une démo précédente --------------------------------------
  await prisma.student.deleteMany({ where: { identifier: { startsWith: "demo." } } });
  await prisma.group.deleteMany({
    where: { authorId: teacher.id, name: { in: GROUPS.map((g) => g.name) } },
  });
  await prisma.exercice.deleteMany({
    where: { authorId: teacher.id, title: { in: EXERCISES.map((e) => e.title) } },
  });

  // --- Exercices ----------------------------------------------------------------
  const exerciseIds: string[] = [];
  for (const e of EXERCISES) {
    const lessonID = idOf(lessons, (l) => l.LessonSubject.label === e.subject, `leçon ${e.subject}`);
    const created = await prisma.exercice.create({
      data: {
        title: e.title,
        description: e.description,
        content: e.content,
        authorId: teacher.id,
        lessonID,
        levelID: idOf(levels, (l) => l.label === e.level, `niveau ${e.level}`),
        typeID: idOf(types, (t) => t.name === e.type, `type ${e.type}`),
      },
    });
    exerciseIds.push(created.id);
  }

  // --- Groupes, élèves et copies --------------------------------------------
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12));
  const password = await hashPassword(DEMO_PASSWORD);
  let submissions = 0;

  for (const group of GROUPS) {
    const lessonIds = Array.from(
      new Set(group.exercises.map((i) => idOf(lessons, (l) => l.LessonSubject.label === EXERCISES[i].subject, "leçon")))
    );
    const createdGroup = await prisma.group.create({
      data: {
        name: group.name,
        authorId: teacher.id,
        exercices: { connect: group.exercises.map((i) => ({ id: exerciseIds[i] })) },
        lessons: { connect: lessonIds.map((id) => ({ id })) },
      },
    });

    for (const [name, profile] of group.students) {
      const identifier = `demo.${name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z]+/g, ".")}`;
      const student = await prisma.student.create({
        data: {
          name,
          identifier,
          password,
          professorId: teacher.id,
          groupId: createdGroup.id,
          isActive: true,
          createdAt: new Date(today.getTime() - 110 * DAY_MS),
        },
      });

      for (const index of group.exercises) {
        const e = EXERCISES[index];
        const published = PUBLISHED_DAYS_AGO[index];
        const delay = Math.floor(random() * 9);
        const daysAgo = published - delay;
        if (daysAgo < 0) continue; // pas encore fait
        if (profile === "inactif" && daysAgo < 25) continue; // ne travaille plus
        if (random() < (profile === "fragile" ? 0.2 : 0.08)) continue; // oubli

        // Le niveau de l'élève évolue : « en baisse » chute sur les dernières semaines
        let ability = ABILITY[profile];
        if (profile === "en-baisse" && daysAgo < 30) ability -= 0.4;
        const success = clamp(
          ability - LEVEL_DIFFICULTY[e.level] - e.extra + (random() - 0.5) * 0.2,
          0,
          1
        );
        const n = itemCount(e);
        const correct = Math.round(success * n);
        const { note, coeficient } = calculateNote({
          level: e.level,
          maxCorrectAnswers: n,
          correctAnswers: correct,
        });
        const createdAt = submissionDate(new Date(today.getTime() - daysAgo * DAY_MS));
        if (createdAt > now) continue;

        await prisma.studentExercice.create({
          data: {
            studentId: student.id,
            exerciceId: exerciseIds[index],
            subject: e.subject,
            response: buildResponse(e, correct),
            note,
            coeficient,
            createdAt,
          },
        });
        submissions += 1;
      }
    }
  }

  // Les élèves sans groupe rejoignent le premier groupe de démo
  // (ceux du seed de base gardent le leur)
  const firstGroup = await prisma.group.findFirst({
    where: { authorId: teacher.id, name: GROUPS[0].name },
  });
  if (firstGroup) {
    await prisma.student.updateMany({
      where: { professorId: teacher.id, groupId: null, identifier: { not: { startsWith: "demo." } } },
      data: { groupId: firstGroup.id },
    });
  }

  console.log(
    `Démo prête : ${GROUPS.length} groupes, ${GROUPS.reduce((s, g) => s + g.students.length, 0)} élèves, ${EXERCISES.length} exercices, ${submissions} copies.`
  );
  console.log(`Mot de passe des élèves de démo : celui de DEMO_PASSWORD dans ${__filename.split(/[\\/]/).pop()}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
