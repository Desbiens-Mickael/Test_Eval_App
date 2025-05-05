import { prisma } from "../../lib/db";

const seed = async () => {
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
};

seed();
