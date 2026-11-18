/**
 * Données de base pour le développement, lancées par `npm run resetDB`.
 *
 * Crée un professeur, un groupe de 4 élèves, 4 leçons (dont 3 attribuées au
 * groupe) et 7 exercices au contenu complet : des exercices pour s'entraîner,
 * un contrôle sans limite déjà rendu par un élève, un contrôle ouvert et un
 * contrôle à venir. Pour un jeu de données plus fourni (3 classes, 18 élèves,
 * ~150 copies) : `npm run seedDemo` ensuite.
 *
 * Comptes :
 *   - professeur : admin@gmail.com / azerty
 *   - élèves : t.desbiens, c.dupont, n.garnier, l.fontaine / azerty22
 */
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";
import { calculateNote, stringToSlug } from "@/lib/utils";
import { randomUUID } from "crypto";

const DAY_MS = 24 * 60 * 60 * 1000;
const STUDENT_PASSWORD = "azerty22";

const STUDENTS: [name: string, identifier: string][] = [
  ["Thibault Desbiens", "t.desbiens"],
  ["Camille Dupont", "c.dupont"],
  ["Noé Garnier", "n.garnier"],
  ["Lina Fontaine", "l.fontaine"],
];

/** Contenu Tiptap simple : un titre puis des paragraphes */
const lessonContent = (title: string, paragraphs: string[]) => ({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: title }] },
    ...paragraphs.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })),
  ],
});

const cards = (...labels: string[]) => labels.map((content) => ({ id: randomUUID(), content }));

/** Texte à trou au format de l'éditeur : les espaces sont des éléments à part */
const gapFill = (sentence: string, blanks: string[]) => {
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

const seed = async () => {
  // --- Professeur -------------------------------------------------------------
  const teacher = await prisma.user.create({
    data: {
      name: "Mickaël Desbiens",
      email: "admin@gmail.com",
      password: await hashPassword("azerty"),
      emailVerified: new Date(),
      role: "ADMIN",
    },
  });

  // --- Référentiels -----------------------------------------------------------
  await prisma.lessonSubject.createMany({
    data: [
      { label: "Mathématique", color: "bg-green-500" },
      { label: "Français", color: "bg-sky-500" },
      { label: "Histoire", color: "bg-yellow-500" },
      { label: "Physique", color: "bg-red-500" },
    ],
  });
  await prisma.gradeLevels.createMany({
    data: [
      { label: "CP", color: "bg-red-500" },
      { label: "CE1", color: "bg-orange-500" },
      { label: "CE2", color: "bg-green-500" },
      { label: "CM1", color: "bg-blue-500" },
      { label: "CM2", color: "bg-purple-500" },
      { label: "6e", color: "bg-pink-500" },
      { label: "5e", color: "bg-indigo-500" },
      { label: "4e", color: "bg-yellow-500" },
      { label: "3e", color: "bg-amber-500" },
    ],
  });
  await prisma.exerciceLevel.createMany({
    data: [
      { label: "Facile", color: "bg-green-500" },
      { label: "Difficile", color: "bg-yellow-500" },
      { label: "Très difficile", color: "bg-red-500" },
    ],
  });
  await prisma.exerciceType.createMany({
    data: [
      { name: "Carte" },
      { name: "Vrai ou Faux" },
      { name: "Texte à trou" },
      { name: "Choix multiple" },
      { name: "Associer par paires" },
      { name: "Remettre dans l'ordre" },
      { name: "Réponse libre" },
    ],
    // Les trois derniers types sont aussi créés par des migrations
    skipDuplicates: true,
  });

  const [subjects, gradeLevels, levels, types] = await Promise.all([
    prisma.lessonSubject.findMany(),
    prisma.gradeLevels.findMany(),
    prisma.exerciceLevel.findMany(),
    prisma.exerciceType.findMany(),
  ]);
  const idBy = <T extends { id: string }>(items: T[], key: keyof T, value: string) => {
    const found = items.find((item) => item[key] === value);
    if (!found) throw new Error(`Introuvable : ${value}`);
    return found.id;
  };
  const subject = (label: string) => idBy(subjects, "label", label);
  const grade = (label: string) => idBy(gradeLevels, "label", label);
  const level = (label: string) => idBy(levels, "label", label);
  const type = (name: string) => idBy(types, "name", name);

  // --- Leçons -----------------------------------------------------------------
  const createLesson = (title: string, subjectLabel: string, gradeLabel: string, paragraphs: string[]) =>
    prisma.lesson.create({
      data: {
        title,
        slug: stringToSlug(title),
        content: lessonContent(title, paragraphs),
        authorId: teacher.id,
        LessonSubjectID: subject(subjectLabel),
        GradeLevelsID: grade(gradeLabel),
      },
    });

  const pythagore = await createLesson("Le théorème de Pythagore", "Mathématique", "4e", [
    "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés : a² + b² = c².",
    "L'hypoténuse est le côté opposé à l'angle droit ; c'est toujours le plus grand côté.",
  ]);
  const verbes = await createLesson("Les verbes irréguliers", "Français", "CM1", [
    "Les verbes irréguliers ne suivent pas une règle unique : leur radical change selon la personne ou le temps.",
    "Exemples au présent : je vais, nous allons ; je prends, nous prenons ; je fais, nous faisons.",
  ]);
  const histoire = await createLesson("La Seconde Guerre mondiale", "Histoire", "CM2", [
    "La Seconde Guerre mondiale a duré de 1939 à 1945 et a opposé les Alliés aux puissances de l'Axe.",
    "Elle commence avec l'invasion de la Pologne le 1er septembre 1939 et se termine en Europe le 8 mai 1945.",
  ]);
  const fusion = await createLesson("La fusion nucléaire", "Physique", "3e", [
    "La fusion nucléaire est la réaction au cours de laquelle deux noyaux légers s'assemblent pour former un noyau plus lourd.",
    "C'est elle qui fait briller le Soleil : des noyaux d'hydrogène y fusionnent pour donner de l'hélium.",
  ]);

  // --- Exercices et contrôles ---------------------------------------------------
  const now = Date.now();
  const createExercise = (data: {
    title: string;
    description: string;
    kind: "PRACTICE" | "CONTROL";
    lessonID: string;
    level: string;
    type: string;
    content: object;
    opensAt?: Date;
    closesAt?: Date;
  }) =>
    prisma.exercice.create({
      data: {
        title: data.title,
        description: data.description,
        kind: data.kind,
        content: data.content,
        opensAt: data.opensAt,
        closesAt: data.closesAt,
        authorId: teacher.id,
        lessonID: data.lessonID,
        levelID: level(data.level),
        typeID: type(data.type),
      },
    });

  const triangle = await createExercise({
    title: "Le triangle rectangle",
    description: "Entraîne-toi à reconnaître un triangle rectangle.",
    kind: "PRACTICE",
    lessonID: pythagore.id,
    level: "Facile",
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
        question: "Comment s'appelle le côté opposé à l'angle droit ?",
        answers: [
          { answer: "L'hypoténuse", isCorrect: true },
          { answer: "La médiane", isCorrect: false },
          { answer: "La hauteur", isCorrect: false },
        ],
      },
    ],
  });

  const controlePythagore = await createExercise({
    title: "Contrôle : Pythagore",
    description: "Contrôle ouvert pendant une semaine.",
    kind: "CONTROL",
    lessonID: pythagore.id,
    level: "Difficile",
    type: "Vrai ou Faux",
    opensAt: new Date(now - DAY_MS),
    closesAt: new Date(now + 7 * DAY_MS),
    content: [
      { question: "Le théorème ne s'applique qu'aux triangles rectangles.", answer: true },
      { question: "Dans un triangle 3-4-5, l'hypoténuse mesure 4.", answer: false },
      { question: "Un triangle 6-8-10 est rectangle.", answer: true },
      { question: "L'hypoténuse peut être plus petite qu'un autre côté.", answer: false },
    ],
  });

  const conjugaison = await createExercise({
    title: "Conjugue les verbes irréguliers",
    description: "Complète avec le verbe conjugué au présent.",
    kind: "PRACTICE",
    lessonID: verbes.id,
    level: "Facile",
    type: "Texte à trou",
    content: gapFill("Le matin je prends le bus, tu vas à pied et nous faisons la course", [
      "prends",
      "vas",
      "faisons",
    ]),
  });

  const verbColumns = [
    { column: "1er groupe", cards: cards("Chanter", "Jouer") },
    { column: "2e groupe", cards: cards("Finir", "Grandir") },
    { column: "3e groupe", cards: cards("Prendre", "Venir") },
  ];
  const groupesVerbes = await createExercise({
    title: "Range les verbes par groupe",
    description: "Place chaque verbe dans son groupe.",
    kind: "CONTROL",
    lessonID: verbes.id,
    level: "Difficile",
    type: "Carte",
    content: verbColumns,
  });

  const reperes = await createExercise({
    title: "Repères 1939-1945",
    description: "Contrôle à venir : il ouvre dans trois jours.",
    kind: "CONTROL",
    lessonID: histoire.id,
    level: "Difficile",
    type: "Choix multiple",
    opensAt: new Date(now + 3 * DAY_MS),
    closesAt: new Date(now + 10 * DAY_MS),
    content: [
      {
        question: "En quelle année commence la Seconde Guerre mondiale ?",
        answers: [
          { answer: "1914", isCorrect: false },
          { answer: "1939", isCorrect: true },
          { answer: "1945", isCorrect: false },
        ],
      },
      {
        question: "Quel pays est envahi le 1er septembre 1939 ?",
        answers: [
          { answer: "La Pologne", isCorrect: true },
          { answer: "La Belgique", isCorrect: false },
          { answer: "La France", isCorrect: false },
        ],
      },
    ],
  });

  const vraiFauxHistoire = await createExercise({
    title: "Vrai ou faux : 1939-1945",
    description: "Entraîne-toi sur les grandes dates de la guerre.",
    kind: "PRACTICE",
    lessonID: histoire.id,
    level: "Facile",
    type: "Vrai ou Faux",
    content: [
      { question: "La guerre se termine en Europe le 8 mai 1945.", answer: true },
      { question: "La Seconde Guerre mondiale a duré dix ans.", answer: false },
      { question: "La Pologne est envahie en 1939.", answer: true },
    ],
  });

  const pairesVerbes = await createExercise({
    title: "Associe chaque verbe à son infinitif",
    description: "Retrouve l'infinitif de chaque verbe conjugué.",
    kind: "PRACTICE",
    lessonID: verbes.id,
    level: "Facile",
    type: "Associer par paires",
    content: [
      { left: "Je vais", right: "Aller" },
      { left: "Nous faisons", right: "Faire" },
      { left: "Ils prennent", right: "Prendre" },
      { left: "Tu viens", right: "Venir" },
    ],
  });

  const ordreHistoire = await createExercise({
    title: "Remets les événements dans l'ordre",
    description: "Classe les événements du plus ancien au plus récent.",
    kind: "CONTROL",
    lessonID: histoire.id,
    level: "Difficile",
    type: "Remettre dans l'ordre",
    content: [
      {
        instruction: "Du plus ancien au plus récent",
        items: [
          "Invasion de la Pologne (1939)",
          "Appel du 18 juin (1940)",
          "Débarquement en Normandie (1944)",
          "Capitulation de l'Allemagne (1945)",
        ],
      },
    ],
  });

  const questionsHistoire = await createExercise({
    title: "Questions sur la guerre",
    description: "Réponds en quelques phrases à chaque question.",
    kind: "CONTROL",
    lessonID: histoire.id,
    level: "Difficile",
    type: "Réponse libre",
    content: [
      {
        question: "Pourquoi le débarquement de juin 1944 est-il important ?",
        points: 4,
        modelAnswer: "Il ouvre un front à l'ouest et lance la libération de la France.",
      },
      {
        question: "Que s'est-il passé le 8 mai 1945 ?",
        points: 2,
        modelAnswer: "L'Allemagne capitule : la guerre se termine en Europe.",
      },
    ],
  });

  // Exercice non attribué au groupe : visible côté professeur uniquement
  await createExercise({
    title: "La fusion nucléaire",
    description: "Vérifie que tu as compris la fusion.",
    kind: "CONTROL",
    lessonID: fusion.id,
    level: "Très difficile",
    type: "Vrai ou Faux",
    content: [
      { question: "La fusion assemble deux noyaux légers.", answer: true },
      { question: "Le Soleil brille grâce à la fission.", answer: false },
    ],
  });

  // --- Groupe et élèves -------------------------------------------------------
  const group = await prisma.group.create({
    data: {
      name: "Groupe découverte",
      authorId: teacher.id,
      lessons: { connect: [pythagore, verbes, histoire].map(({ id }) => ({ id })) },
      exercices: {
        connect: [
          triangle,
          controlePythagore,
          conjugaison,
          groupesVerbes,
          reperes,
          vraiFauxHistoire,
          pairesVerbes,
          ordreHistoire,
          questionsHistoire,
        ].map(({ id }) => ({ id })),
      },
    },
  });

  const password = await hashPassword(STUDENT_PASSWORD);
  const students = [];
  for (const [name, identifier] of STUDENTS) {
    students.push(
      await prisma.student.create({
        data: { name, identifier, password, professorId: teacher.id, groupId: group.id },
      })
    );
  }

  // --- Une copie rendue, pour que les résultats ne soient pas vides ----------
  const { note, coeficient } = calculateNote({ level: "Difficile", maxCorrectAnswers: 6, correctAnswers: 5 });
  const [colonne1, colonne2, colonne3] = verbColumns;
  await prisma.studentExercice.create({
    data: {
      studentId: students[0].id,
      exerciceId: groupesVerbes.id,
      subject: "Français",
      note,
      coeficient,
      // « Venir » rangé par erreur dans le 2e groupe
      response: [
        colonne1,
        { column: colonne2.column, cards: [...colonne2.cards, colonne3.cards[1]] },
        { column: colonne3.column, cards: [colonne3.cards[0]] },
      ],
    },
  });

  // --- Une réponse libre à corriger -----------------------------------------
  await prisma.studentExercice.create({
    data: {
      studentId: students[1].id,
      exerciceId: questionsHistoire.id,
      subject: "Histoire",
      note: 0,
      coeficient: 10,
      pendingReview: true,
      response: [
        { index: 0, answer: "Les Alliés arrivent en Normandie et commencent à libérer la France." },
        { index: 1, answer: "La fin de la guerre." },
      ],
    },
  });

  console.log(
    `Base prête : 1 professeur, ${students.length} élèves dans « ${group.name} », 4 leçons, 10 exercices et contrôles, 1 copie à corriger.`
  );
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
