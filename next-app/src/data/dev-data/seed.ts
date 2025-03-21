import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";
import { stringToSlug } from "@/lib/utils";

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

  const student = await prisma.student.create({
    data: {
      name: "Thibault Desbiens",
      professorId: userAdmin.id,
      identifier: "t.desbiens",
      password: await hashPassword("azerty"),
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

  // create GradeLevels for user
  await prisma.gradeLevels.createMany({
    data: [
      {
        label: "CP",
        color: "bg-red-500",
      },
      {
        label: "CE1",
        color: "bg-orange-500",
      },
      {
        label: "CE2",
        color: "bg-green-500",
      },
      {
        label: "CM1",
        color: "bg-blue-500",
      },
      {
        label: "CM2",
        color: "bg-purple-500",
      },
      {
        label: "6e",
        color: "bg-pink-500",
      },
      {
        label: "5e",
        color: "bg-indigo-500",
      },
      {
        label: "4e",
        color: "bg-yellow-500",
      },
      {
        label: "3e",
        color: "bg-amber-500",
      },
    ],
  });

  const gradeLevels = await prisma.gradeLevels.findMany();

  // create Lesson
  await prisma.lesson.createMany({
    data: [
      {
        title: "Le theorème de pythagore",
        LessonSubjectID: subjects[0].id,
        GradeLevelsID: gradeLevels[0].id,
        authorId: userAdmin.id,
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Le théorème de Pythagore" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Le théorème de Pythagore est un théorème de géométrie.",
                },
              ],
            },
          ],
        },
        slug: stringToSlug("Le theorème de pythagore"),
      },
      {
        title: "Les verbes irréguliers",
        LessonSubjectID: subjects[1].id,
        GradeLevelsID: gradeLevels[2].id,
        authorId: userAdmin.id,
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "Les verbes irréguliers" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Les verbes irréguliers sont des verbes qui ne suivent pas une règle unique.",
                },
              ],
            },
          ],
        },
        slug: stringToSlug("Les verbes irréguliers"),
      },
      {
        title: "L'histoire de la troisième guerre mondiale",
        LessonSubjectID: subjects[2].id,
        GradeLevelsID: gradeLevels[3].id,
        authorId: userAdmin.id,
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [
                {
                  type: "text",
                  text: "L'histoire de la troisième guerre mondiale",
                },
              ],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "La troisième guerre mondiale est une guerre mondiale de 1939 à 1945.",
                },
              ],
            },
          ],
        },
        slug: stringToSlug("L'histoire de la troisième guerre mondiale"),
      },
      {
        title: "La fusion nucléaire",
        LessonSubjectID: subjects[3].id,
        GradeLevelsID: gradeLevels[6].id,
        authorId: userAdmin.id,
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [{ type: "text", text: "La fusion nucléaire" }],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "La fusion nucléaire est un processus dans lequel deux atomes fusionnent.",
                },
              ],
            },
          ],
        },
        slug: stringToSlug("La fusion nucléaire"),
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

  await prisma.exerciceType.createMany({
    data: [
      {
        name: "Carte",
      },
      {
        name: "Vrai ou Faux",
      },
      {
        name: "Texte à trou",
      },
      {
        name: "Choix multiple",
      },
    ],
  });

  const types = await prisma.exerciceType.findMany();

  // create Exercice
  await prisma.exercice.createMany({
    data: [
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[0].id,
        authorId: userAdmin.id,
        lessonID: lessons[0].id,
        typeID: types[0].id,
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
        content: {},
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[1].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        typeID: types[0].id,
        description: "Trouve la bonne reponse pour la phusion nucleaire",
        content: {},
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[2].id,
        authorId: userAdmin.id,
        lessonID: lessons[1].id,
        typeID: types[3].id,
        description: "Trouve la bonne reponse pour les verbes irreguliers",
        content: {},
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[2].id,
        authorId: userAdmin.id,
        lessonID: lessons[2].id,
        typeID: types[1].id,
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
        content: {},
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[2].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        typeID: types[1].id,
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
        content: {},
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[1].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        typeID: types[2].id,
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
        content: {},
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[0].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        typeID: types[3].id,
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
        content: {},
      },
      {
        title: "Trouve les bonnes reponses",
        levelID: levels[2].id,
        authorId: userAdmin.id,
        lessonID: lessons[3].id,
        typeID: types[3].id,
        description: "Trouve la bonne reponse pour le theoreme de pythagore",
        content: {},
      },
    ],
  });
};

seed();
