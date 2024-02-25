import prisma from "@/utils/db";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  noStore();
  const id = parseInt(params.id, 10);

  const user = await prisma.user.findUnique({ where: { id: id } });
  await prisma.$disconnect();

  if (!user) return NextResponse.json({ message: "User not found" });

  return NextResponse.json({ data: user });
}
