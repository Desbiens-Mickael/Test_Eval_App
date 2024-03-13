import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { getUserByEmail } from "@/data/user-data";
import { verifyPassword } from "@/lib/hash-password";
import { loginFormSchema } from "@/schema/shema-zod";
import type { NextAuthConfig } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    /** The user role. */
    role: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user role. */
    role: string;
  }
}

export default {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        console.log(credentials);
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
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
      };
    },
  },
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig;
