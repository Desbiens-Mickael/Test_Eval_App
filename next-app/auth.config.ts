import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { deleteTwoFactorComfirmationById, getTwoFactorComfirmationByUserId } from "@/data/two-factor-comfirmation";
import { UpdateUser, getUserByEmail, getUserById } from "@/data/user-data";
import { deleteVerificationTokenById, getVerificationTokenByIdentifier } from "@/data/verification-token-data";
import { verifyPassword } from "@/lib/hash-password";
import { loginFormSchema } from "@/schema/shema-zod";
import { UserRole } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    /** The user role. */
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth?: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user role. */
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }
}

export default {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const isCredentialsValide = loginFormSchema.safeParse(credentials);
        if (isCredentialsValide.success) {
          const { email, password } = isCredentialsValide.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordMatch = await verifyPassword(user.password, password);
          if (passwordMatch) {
            return user;
          }
        }

        return null;
      },
    }),
    Google,
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user) return false;

      const existingUser = await getUserById(user.id as string);

      // Prevent sign in without email verification
      if (!existingUser?.email || !existingUser?.emailVerified) return false;

      const existingVerification = await getVerificationTokenByIdentifier(existingUser.email);

      // Deletion of the token if the email has been verified
      if (existingVerification) await deleteVerificationTokenById(existingVerification.id);

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorComfirmation = await getTwoFactorComfirmationByUserId(existingUser.id);

        if (!twoFactorComfirmation) return false;

        await deleteTwoFactorComfirmationById(twoFactorComfirmation.id);
      }

      return true;
    },
    async jwt({ token, account, trigger }) {
      if (!token.sub) return token;

      if (trigger === "signIn" || trigger === "update") {
        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token;

        token.name = existingUser.name;
        token.email = existingUser.email;
        token.picture = existingUser.image;
        token.role = existingUser.role;
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
        token.isOAuth = !!account?.access_token;
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
      await UpdateUser(user.id as string, { emailVerified: new Date() });
    },
  },
} satisfies NextAuthConfig;
