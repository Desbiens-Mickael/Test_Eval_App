import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const params = req.nextUrl.search;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const authRoutes = [
    "/auth/inscription",
    "/auth/connexion",
    "/auth/new-password",
    "/auth/new-verification",
    "/auth/reset-password",
  ];

  const isHomeRoutes = !!req.nextUrl.pathname.match("^/$");
  const isAdminRoutes = !!req.nextUrl.pathname.match("^/admin");
  const isStudentRoutes = !!req.nextUrl.pathname.match("^/eleve");
  const isAuthRoutes = !!authRoutes.includes(req.nextUrl.pathname); //!!req.nextUrl.pathname.match("^/auth");
  const isAcountRoute = !!req.nextUrl.pathname.match("^/profil");

  const fixUrl = ["/api/auth/auth/connexion", "/api/auth/auth/error"];

  // Utilisateur non connecter
  if ((isAdminRoutes || isStudentRoutes || isAcountRoute) && !isLoggedIn)
    return NextResponse.redirect(new URL("/auth/connexion", nextUrl));

  if (fixUrl.includes(req.nextUrl.pathname)) {
    const redirectUrl = `${req.nextUrl.pathname.replace(
      "/api/auth",
      ""
    )}${params}`;
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }

  // Rôle User
  if (
    (isHomeRoutes && userRole === "STUDENT") ||
    (isAdminRoutes && userRole !== "ADMIN") ||
    (isAuthRoutes && userRole === "STUDENT")
  )
    return NextResponse.redirect(new URL("/eleve/dashboard", nextUrl));

  // Rôle Admin
  if (
    (isHomeRoutes && userRole === "ADMIN") ||
    (isAuthRoutes && userRole === "ADMIN")
  )
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trcp)(.*)"],
};
