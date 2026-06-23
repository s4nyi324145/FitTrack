// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    
    Credentials({}),
  ],
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
    error: "/login",
  },
  callbacks: {
   
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        if ("onboarding_completed" in user) {
          token.onboarded = (user as any).onboarding_completed;
        }
      }
      if (trigger === "update" && session) {
        token.onboarded = session.onboarded;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).onboarded = token.onboarded as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;