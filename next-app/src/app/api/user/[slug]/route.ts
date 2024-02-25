import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  const user = await prisma.user.findMany({ where: { name: slug } });
  await prisma.$disconnect();

  if (!user) return NextResponse.json({ message: "User not found" });

  return NextResponse.json({ data: user });
}
