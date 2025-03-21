import CredentialsProvider from "next-auth/providers/credentials";
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
  loginStudentFormSchema,
  loginUserFormSchema,
} from "@/shema-zod/auth.shema";
import { Student, User, UserRole } from "@prisma/client";
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
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const isCredentialsAdminValide =
          loginUserFormSchema.safeParse(credentials); // Vérification Admin
        const isCredentialsStudentValide =
          loginStudentFormSchema.safeParse(credentials); // Vérification Student

        // Vérification Admin
        if (isCredentialsAdminValide.success) {
          const { email, password } = isCredentialsAdminValide.data;

          const user = await getUserByEmailData(email);
          if (!user || !user.password) return null;

          const passwordMatch = await verifyPassword(user.password, password);
          if (passwordMatch) {
            return user;
          }
        }

        // Vérification student
        if (isCredentialsStudentValide.success) {
          const { identifier, password } = isCredentialsStudentValide.data;

          const student = await getStudentByIdentifierlData(identifier);
          if (!student || !student.password) return null;

          const passwordMatch = await verifyPassword(
            student.password,
            password
          );
          if (passwordMatch) {
            return student;
          }
        }

        // Si rien n'est bon on retourne null
        return null;
      },
    }),
    Google,
  ],
  callbacks: {
    async signIn({ user, account }) {
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

      // Vérification si role est STUDENT
      if (user.role === "STUDENT") {
        const existingUser = await getStudentByIdData(user.id as string);
        if (!existingUser) return false;

        return true;
      }

      return false;
    },
    async jwt({ token, account, trigger }) {
      if (!token.sub) return token;

      if (trigger === "signIn") token.isOAuth = !!account?.access_token;

      if (trigger === "signIn" || trigger === "update") {
        let existingData: User | Student | null;
        // Selon le rôle, récupère les données depuis le modèle approprié
        if (token.role === "STUDENT") {
          existingData = await getStudentByIdData(token.sub);
          token.identifier = existingData?.identifier;
          token.email = "";
          token.isTwoFactorEnabled = false;
        } else {
          existingData = await getUserByIdData(token.sub);
          token.email = existingData?.email || "";
          token.isTwoFactorEnabled = existingData?.isTwoFactorEnabled || false;
        }
        if (existingData) {
          token.name = existingData?.name;
          token.picture = existingData.image;
          token.role = existingData.role;
        }

        // const existingUser = await getUserByIdData(token.sub);
        // if (!existingUser) return token;
        // token.name = existingUser.name;
        // token.email = existingUser.email;
        // token.picture = existingUser.image;
        // token.role = existingUser.role;
        // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          isTwoFactorEnabled: token.isTwoFactorEnabled,
          isOAuth: token.isOAuth,
          id: token.sub,
        },
      };
    },
  },
  events: {
    async linkAccount({ user }) {
      await UpdateUserData(user.id as string, { emailVerified: new Date() });
    },
  },
} satisfies NextAuthConfig;
