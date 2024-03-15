import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const params = req.nextUrl.search;

  const fixUrl = ["/api/auth/auth/login", "/api/auth/auth/error"];

  if (req.nextUrl.pathname.match("^/admin") && req.auth?.user?.role !== "ADMIN") return NextResponse.redirect(new URL("/", nextUrl));
  if (req.nextUrl.pathname.match("^/auth") && req.auth?.user) return NextResponse.redirect(new URL("/", nextUrl));

  if (fixUrl.includes(req.nextUrl.pathname)) {
    const redirectUrl = `${req.nextUrl.pathname.replace("/api/auth", "")}${params}`;
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trcp)(.*)"],
};
