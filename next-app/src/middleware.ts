import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const params = req.nextUrl.search;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAdminRoutes = !!req.nextUrl.pathname.match("^/admin");
  const isUserRoutes = !!req.nextUrl.pathname.match("^/user");
  const isAuthRoutes = !!req.nextUrl.pathname.match("^/auth");

  const fixUrl = ["/api/auth/auth/login", "/api/auth/auth/error"];

  // Utilisateur non connecter
  if ((isAdminRoutes && !isLoggedIn) || (isUserRoutes && !isLoggedIn)) return NextResponse.redirect(new URL("/", nextUrl));

  if (fixUrl.includes(req.nextUrl.pathname)) {
    const redirectUrl = `${req.nextUrl.pathname.replace("/api/auth", "")}${params}`;
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }

  // Utilisateur User
  if ((isAdminRoutes && userRole !== "ADMIN") || (isAuthRoutes && userRole === "USER")) return NextResponse.redirect(new URL("/user/dashboard", nextUrl));

  // Utilisateur Admin
  if (isAuthRoutes && userRole === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trcp)(.*)"],
};
