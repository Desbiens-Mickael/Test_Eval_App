import prisma from "@/utils/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId, 10);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  await prisma.$disconnect();

  if (!user) return NextResponse.json({ message: "User not found" });

  return NextResponse.json({ data: user });
}
