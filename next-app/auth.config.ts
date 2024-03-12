import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

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

const credentialsConfig = CredentialsProvider({
  // credentials: {
  //   username: { label: "Nom d'utilisateur", type: "text", placeholder: "jsmith" },
  //   password: { label: "Mot de passe", type: "password" },
  // },
  async authorize({ email, password }, req) {
    const user = { id: "1", name: "J Smith", email: "jsmith@example.com", role: "User" };

    return null;
  },
});

export default {
  providers: [credentialsConfig, Google],
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
} satisfies NextAuthConfig;
