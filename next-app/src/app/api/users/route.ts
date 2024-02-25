import prisma from "@/utils/db";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  noStore();
  const users = await prisma.user.findMany();
  await prisma.$disconnect();

  return NextResponse.json({ data: users });
}

export async function POST(request: Request) {
  const data = await request.json();

  const user = await prisma.user.create({ data: { name: data.name, email: data.email } });
  await prisma.$disconnect();

  return NextResponse.json({ user });
}
