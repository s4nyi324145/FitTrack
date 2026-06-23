// auth.ts
import NextAuth from "next-auth";
import PostgresAdapter from "@auth/pg-adapter";
import pool from "@/lib/pg";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials"; // 1. JAVÍTÁS: Ez hiányzott!
import { authConfig } from "../auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, 
  adapter: PostgresAdapter(pool), 
  
  providers: [
    // Kivesszük az auth.config-ból a Google és GitHub providereket, a Credentials-t pedig eldobjuk
    ...authConfig.providers.filter((p) => p.id !== "credentials"), 
    
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;

        try {
         
          const userResult = await pool.query(
            `SELECT u.id, u.email, u.password_hash, u.name, p.onboarding_completed 
             FROM users u
             INNER JOIN user_profiles p ON u.id = p.user_id
             WHERE u.email = $1`,
            [email]
          );

          if (userResult.rows.length === 0) return null;
          const user = userResult.rows[0];

  
          const isPasswordValid = await bcrypt.compare(password, user.password_hash);
          if (!isPasswordValid) return null;

        
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            onboarding_completed: user.onboarding_completed,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  
    callbacks: {
    async jwt({ token, user, trigger, session }) {
      
      
      if (user) {
        token.id = user.id;
        
        // Megvizsgáljuk, hogy az adatbázisból jövő 'user' objektumnak van-e ilyen mezője
        const customUser = user as any;
        
        if (customUser.onboarding_completed !== undefined) {
          // Credentials login esetén az authorize függvényből azonnal megkapjuk
          token.onboarded = customUser.onboarding_completed;
        } else {
          // Google / GitHub login esetén manuálisan kell lekérnünk az adatbázisból
          try {
            const profileRes = await pool.query(
              "SELECT onboarding_completed FROM user_profiles WHERE user_id = $1",
              [user.id]
            );
            
            if (profileRes.rows.length > 0) {
              token.onboarded = profileRes.rows[0].onboarding_completed;
            } else {
              token.onboarded = false;
            }
          } catch (error) {
            console.error("OAuth profile fetch error in JWT callback:", error);
            token.onboarded = false; // Hiba esetén biztonsági okokból false
          }
        }
      }
      

      if (trigger === "update" && session && session.onboarded !== undefined) {
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
  }
});