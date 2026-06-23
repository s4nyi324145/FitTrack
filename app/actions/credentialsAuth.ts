"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import pool from "@/lib/pg";
import { hashingPassword } from "@/lib/utils/password";

export async function doRegister(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  if (!email || !password || !firstName || !lastName) {
    return { error: "Security check failed: All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Security check failed: Invalid email format." };
  }

  if (password.length < 8) {
    return {
      error: "Security check failed: Password must be at least 8 characters.",
    };
  }

  try {
    const isCreated = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email],
    );

    if (isCreated.rows.length !== 0) {
      return { error: "Email is already in use" };
    }

    const passwordHash = await hashingPassword(password);

    const userInsert = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
      [email, passwordHash, `${firstName} ${lastName}`],
    );

    const newUserId = userInsert.rows[0].id;

    await pool.query(
      "INSERT INTO user_profiles (user_id, onboarding_completed) VALUES ($1, false)",
      [newUserId],
    );

    return { success: true };
  } catch (error) {
    console.error("Register error on server:", error);
    return { error: "An unexpected server error occurred." };
  }
}

export async function doCredentialsLogin(email: string, password: string) {
  if (!email || !password) {
    return { error: "Please fill out all fields" };
  }

  try {
    
    await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });

    return { success: true };
  } catch (error) {
    
    if (error instanceof AuthError) {
    
       
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong during sign in" };
      }
    }

    
    if ((error as any).message?.includes("NEXT_REDIRECT")) {
      return { success: true };
    }

    console.error("Login server error:", error);
    return { error: "An unexpected error occurred" };
  }
}
