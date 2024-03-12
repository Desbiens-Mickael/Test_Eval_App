import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";
export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  if (req.nextUrl.pathname.match("^/admin") && req.auth?.user?.role !== "ADMIN") return NextResponse.redirect(new URL("/", nextUrl));
  if (req.nextUrl.pathname.match("^/auth") && req.auth?.user) return NextResponse.redirect(new URL("/", nextUrl));
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trcp)(.*)"],
};
