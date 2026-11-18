import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import {
  getStudentByIdData,
  getStudentByIdentifierlData,
} from "@/data/student-data";
import {
  deleteTwoFactorComfirmationByIdData,
  getTwoFactorComfirmationByUserIdData,
} from "@/data/two-factor-comfirmation.data";
import {
  UpdateUserData,
  getUserByEmailData,
  getUserByIdData,
} from "@/data/user-data";
import {
  deleteVerificationTokenByIdData,
  getVerificationTokenByIdentifierData,
} from "@/data/verification-token-data";
import { verifyPassword } from "@/lib/hash-password";
import {
  checkLoginLock,
  clearAccountFailures,
  getClientIp,
  recordLoginFailure,
} from "@/lib/login-guard";
import {
  loginStudentFormSchema,
  loginUserFormSchema,
} from "@/shema-zod/auth.shema";
import { UserRole } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    /** The user role. */
    role: UserRole;
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
    identifier?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user role. */
    role: UserRole;
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
    identifier?: string;
  }
}

export default {
  pages: {
    signIn: "/auth/connexion",
    error: "/auth/error",
  },
  basePath: "/api/auth",
  providers: [
    Credentials({
      // La limite des tentatives est aussi appliquée ici : l'API de NextAuth
      // peut être appelée directement, sans passer par les actions de connexion
      authorize: async (credentials, request) => {
        const ip = request ? getClientIp(request.headers) : null;
        const isCredentialsAdminValide =
          loginUserFormSchema.safeParse(credentials); // Vérification Admin
        const isCredentialsStudentValide =
          loginStudentFormSchema.safeParse(credentials); // Vérification Student

        // Vérification Admin
        if (isCredentialsAdminValide.success) {
          const { email, password } = isCredentialsAdminValide.data;
          const attempt = { kind: "user" as const, login: email, ip };
          if (await checkLoginLock(attempt)) return null;

          const user = await getUserByEmailData(email);
          const passwordMatch =
            !!user?.password && (await verifyPassword(user.password, password));
          if (user && passwordMatch) {
            await clearAccountFailures("user", email);
            return user;
          }
          await recordLoginFailure(attempt);
          return null;
        }

        // Vérification student
        if (isCredentialsStudentValide.success) {
          const { identifier, password } = isCredentialsStudentValide.data;
          const attempt = { kind: "student" as const, login: identifier, ip };
          if (await checkLoginLock(attempt)) return null;

          const student = await getStudentByIdentifierlData(identifier);
          const passwordMatch =
            !!student?.password &&
            (await verifyPassword(student.password, password));
          if (student && passwordMatch) {
            await clearAccountFailures("student", identifier);
            return student;
          }
          await recordLoginFailure(attempt);
          return null;
        }

        // Si rien n'est bon on retourne null
        return null;
      },
    }),
    Google({
      authorization: {
        params: {
          access_type: "offline", // Permet de récupérer un refresh token
          prompt: "consent", // Force l'utilisateur à accepter les conditions
          response_type: "code", // Type de réponse
        },
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      if (!user) return false;

      // Vérification si role est ADMIN
      if (user.role === "ADMIN") {
        const existingUser = await getUserByIdData(user.id as string);

        // Prevent sign in without email verification
        if (!existingUser?.email || !existingUser?.emailVerified) return false;

        const existingVerification = await getVerificationTokenByIdentifierData(
          existingUser.email
        );

        // Deletion of the token if the email has been verified
        if (existingVerification)
          await deleteVerificationTokenByIdData(existingVerification.id);

        if (existingUser.isTwoFactorEnabled) {
          const twoFactorComfirmation =
            await getTwoFactorComfirmationByUserIdData(existingUser.id);

          if (!twoFactorComfirmation) return false;

          await deleteTwoFactorComfirmationByIdData(twoFactorComfirmation.id);
        }

        return true;
      }

      // Parent : compte créé par le professeur, adresse déjà vérifiée
      if (user.role === "PARENT") {
        const existingUser = await getUserByIdData(user.id as string);
        return !!existingUser?.emailVerified;
      }

      // Vérification si role est STUDENT
      if (user.role === "STUDENT") {
        const existingUser = await getStudentByIdData(user.id as string);
        if (!existingUser || existingUser.disabledAt) return false;

        return true;
      }

      return false;
    },
    jwt: async ({ token, account, trigger, user }) => {
      if (!token.sub) return token;

      // Gérer l'OAuth
      if (trigger === "signIn") {
        token.isOAuth = !!account?.access_token;
      }

      // Récupérer les données utilisateur/student
      if (["signIn", "signUp", "update"].includes(trigger!)) {
        const [user, student] = await Promise.all([
          getUserByIdData(token.sub),
          getStudentByIdData(token.sub),
        ]);

        if (student) {
          token.identifier = student.identifier;
          token.role = student.role;
          token.name = student.name;
          token.picture = student.image;
        } else if (user) {
          token.email = user.email ?? "";
          token.isTwoFactorEnabled = user.isTwoFactorEnabled ?? false;
          token.role = user.role;
          token.name = user.name;
          token.picture = user.image;
        } else {
          console.warn(
            "Aucun utilisateur trouvé pour le token.sub :",
            token.sub
          );
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session = {
          ...session,
          user: {
            ...session.user,
            identifier: token.identifier,
            role: token.role,
            isTwoFactorEnabled: token.isTwoFactorEnabled,
            isOAuth: token.isOAuth,
            id: token.sub as string,
          },
        };
      }

      return session;
    },
  },
  events: {
    linkAccount: async ({ user }) => {
      await UpdateUserData(user.id as string, { emailVerified: new Date() });
    },
  },
} satisfies NextAuthConfig;
