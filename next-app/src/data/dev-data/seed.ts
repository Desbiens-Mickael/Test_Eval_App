import prisma from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";

const seed = async () => {
  // Creating admin and user users
  const userAdmin = await prisma.user.create({
    data: {
      name: "Mickaël Desbiens",
      email: "admin@gmail.com",
      password: await hashPassword("azerty"),
      emailVerified: new Date(),
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Mickaël Desbiens",
      email: "user@gmail.com",
      password: await hashPassword("azerty"),
      emailVerified: new Date(),
    },
  });

  // create LessonSubject
  await prisma.lessonSubject.createMany({
    data: [
      {
        label: "Mathématique",
        color: "bg-green-500",
      },
      {
        label: "Français",
        color: "bg-sky-500",
      },
      {
        label: "Histoire",
        color: "bg-yellow-500",
      },
      {
        label: "Physique",
        color: "bg-red-500",
      },
    ],
  });

  const subjects = await prisma.lessonSubject.findMany();

  // create Lesson
  await prisma.lesson.createMany({
    data: [
      {
        name: "Le theorème de pythagore",
        LessonSubjectID: subjects[0].id,
        authorId: userAdmin.id,
        content: "Le theoreme de pythagore est un theoreme de geometrie.",
      },
      {
        name: "Les verbes irreguliers",
        LessonSubjectID: subjects[1].id,
        authorId: userAdmin.id,
        content: "Les verbes irreguliers sont des verbes qui ne sont pas uniques",
      },
      {
        name: "L'histoire de la troisième guerre mondiale",
        LessonSubjectID: subjects[2].id,
        authorId: userAdmin.id,
        content: "La troisième guerre mondiale est une guerre mondiale de 1939 à 1945.",
      },
      {
        name: "La phusion nucleaire",
        LessonSubjectID: subjects[3].id,
        authorId: userAdmin.id,
        content: "La phusion nucleaire est un processus de fusion nucleaire qui consiste en la fusion des atomes.",
      },
    ],
  });

  const lessons = await prisma.lesson.findMany();

  // create Level
  await prisma.exerciceLevel.createMany({
    data: [
      {
        label: "Facile",
        color: "bg-green-500",
      },
      {
        label: "Difficile",
        color: "bg-yellow-500",
      },
      {
        label: "Très difficile",
        color: "bg-red-500",
      },
    ],
  });

  const levels = await prisma.exerciceLevel.findMany();

  // create Exercice
  await prisma.exercice.createMany({
    data: [
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[0].id,
        authorId: userAdmin.id,
        lessonID: lessons[0].id,
        type: "Card",
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[1].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        type: "Card",
        description: "Trouve la bonne reponse pour la phusion nucleaire",
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[2].id,
        authorId: userAdmin.id,
        lessonID: lessons[1].id,
        type: "Card",
        description: "Trouve la bonne reponse pour les verbes irreguliers",
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[2].id,
        authorId: userAdmin.id,
        lessonID: lessons[2].id,
        type: "Card",
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[2].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        type: "Fill_blank",
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[1].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        type: "Fill_blank",
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[0].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        type: "True_or_False",
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[2].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        type: "List",
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
      },
    ],
  });

  const exercices = await prisma.exercice.findMany();

  // create Card Exercice
  await prisma.contentExerciceCard.createMany({
    data: [
      {
        exerciceID: exercices[0].id,
        content: { "colonne-1": ["reponse 1", "reponse 2", "reponse 3"], "colonne-2": ["reponse 4", "reponse 5", "reponse 6"] },
        correctAnswer: { "colonne-1": ["reponse 1", "reponse 2", "reponse 3"], "colonne-2": ["reponse 4", "reponse 5", "reponse 6"] },
      },
      {
        exerciceID: exercices[1].id,
        content: { "colonne-1": ["reponse 1", "reponse 2", "reponse 3"], "colonne-2": ["reponse 4", "reponse 5", "reponse 6"] },
        correctAnswer: { "colonne-1": ["reponse 1", "reponse 2", "reponse 3"], "colonne-2": ["reponse 4", "reponse 5", "reponse 6"] },
      },
      {
        exerciceID: exercices[2].id,
        content: { "colonne-1": ["reponse 1", "reponse 2", "reponse 3"], "colonne-2": ["reponse 4", "reponse 5", "reponse 6"] },
        correctAnswer: { "colonne-1": ["reponse 1", "reponse 2", "reponse 3"], "colonne-2": ["reponse 4", "reponse 5", "reponse 6"] },
      },
      {
        exerciceID: exercices[3].id,
        content: { "colonne-1": ["reponse 1", "reponse 2", "reponse 3"], "colonne-2": ["reponse 4", "reponse 5", "reponse 6"] },
        correctAnswer: { "colonne-1": ["reponse 1", "reponse 2", "reponse 3"], "colonne-2": ["reponse 4", "reponse 5", "reponse 6"] },
      },
    ],
  });
};

seed();
