"use client";

import React, { useState } from "react";
import InputField from "@/components/shared/InputField";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { doCredentialsLogin } from "@/app/actions/credentialsAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const handleLogin = async(e: React.FormEvent) => {
      e.preventDefault()
      setError(null)
      setIsLoading(true)

      try {
        const result = await doCredentialsLogin(email,password)

        if(result?.error) {
          setError(result.error)
          setIsLoading(false)
        } else if(result?.success){
          router.push("/dashboard")
          router.refresh()
        }

      } catch (error) {
        setError("Something went wrong on the server")
        setIsLoading(false)
      }
  }

  return (
    <div className="flex min-h-screen w-full flex-1 items-center justify-center bg-background px-4 py-10 font-sans sm:px-6">
      <div className="flex w-full max-w-md flex-col gap-2 rounded-card border border-border bg-surface p-6 text-foreground shadow-sm sm:p-8">
        <div className="flex w-full flex-col items-center gap-3">
          <div className="flex w-full items-center justify-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-btn bg-primary-muted text-base font-black text-primary">
              FT
            </div>
            <h1 className="text-2xl font-bold">FitTracker</h1>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-xl font-bold">Welcome back</h2>
            <p className="text-sm text-text-subtle">
              Log in to continue your fitness journey
            </p>
          </div>

          <OAuthButtons />

          <div className="w-full mt-4 flex items-center gap-2">
            <hr className="flex-1 border-border" />
            <p className="text-xs text-text-subtle whitespace-nowrap">
              or continue with email
            </p>
            <hr className="flex-1 border-border" />
          </div>
        </div>

        {error && <p className="text-red-500 font-bold text-sm bg-red-500/10 p-2 rounded">{error}</p>}

        <form onSubmit={handleLogin} className="flex w-full mt-4 flex-col gap-4">
          <InputField
            label="Email"
            placeholder="johndoe@example.com"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <InputField
              label="Password"
              placeholder="••••••"
              value={password}
              type="password"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a
              href="/forgot-password"
              className="mt-1 self-end text-xs font-bold text-primary transition-colors hover:text-primary-hover"
            >
              Forgot password?
            </a>
          </div>

           <button
              type="submit"
              disabled={isLoading}
              className="mt-4 h-11 cursor-pointer disabled:cursor-not-allowed disabled:bg-primary/60 rounded-btn bg-primary px-4 text-sm font-bold text-sidebar transition-colors hover:bg-primary-hover focus:outline-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-4">
                  Signing in...
                  <RefreshCcw className="animate-spin" />
                </span>
              ) : (
                "Sign In"
              )}
            </button>


          <p className="text-sm text-center text-text-subtle">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-bold text-primary transition-colors hover:text-primary-hover"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
