import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const params = req.nextUrl.search;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isHomeRoutes = !!req.nextUrl.pathname.match("^/$");
  const isAdminRoutes = !!req.nextUrl.pathname.startsWith("/admin");
  const isStudentRoutes = !!req.nextUrl.pathname.startsWith("/eleve");
  const isAuthRoutes = !!(
    req.nextUrl.pathname.startsWith("/auth") &&
    !req.nextUrl.pathname.endsWith("/reset-email")
  );
  const isAcountRoute = !!req.nextUrl.pathname.startsWith("/profil");

  // Utilisateur non connecter
  if ((isAdminRoutes || isStudentRoutes || isAcountRoute) && !isLoggedIn)
    return NextResponse.redirect(new URL("/auth/connexion", nextUrl));

  if (req.nextUrl.pathname.startsWith("/api/auth/auth/")) {
    const redirectUrl = `${req.nextUrl.pathname.replace(
      "/api/auth",
      ""
    )}${params}`;
    return NextResponse.redirect(new URL(redirectUrl, nextUrl));
  }

  // Rôle User
  if (userRole === "STUDENT" && (isHomeRoutes || isAdminRoutes || isAuthRoutes))
    return NextResponse.redirect(new URL("/eleve/dashboard", nextUrl));

  // Rôle Admin
  if (userRole === "ADMIN" && (isHomeRoutes || isStudentRoutes || isAuthRoutes))
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trcp)(.*)"],
};
