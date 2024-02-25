"use server";

import prisma from "@/utils/db";

export const createUser = async () => {
  await prisma.user.create({
    data: {
      name: "D Loper2",
      email: "d.loper2@gmail.com",
    },
  });
  await prisma.$disconnect();
};

export const fetchUser = async () => {
  const allUsers = await prisma.user.findMany();
  await prisma.$disconnect();
  console.log(allUsers);
};
