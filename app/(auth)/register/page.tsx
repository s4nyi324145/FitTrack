"use client";

import React, { useState } from "react";
import { passwordStrength } from "@/lib/utils/password";
import InputField from "@/components/shared/InputField";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { doRegister } from "@/app/actions/credentialsAuth";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()


   const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
    if (!email || !password || !firstName || !lastName) {
    return setError("Fill out every fill");
  }
    
     if(password.length < 8) {
      return setError("Password must be at least 8 characters.")
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!isChecked) {
      setError("You must agree to the Terms and Conditions!");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await doRegister(email, password, firstName, lastName);
      console.log(result);
      
      if (result?.error) {
        setError(result.error); 
        setIsLoading(false); 
      } else if (result?.success) {
        router.push("/login");
       
      }
    } catch (error) {
      console.error(error);
      setError("Server error");
      setIsLoading(false); 
    }
  };

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
            <h2 className="text-xl font-bold">Create an account</h2>
            <p className="text-sm text-text-subtle">
              Start tracking your fitness today
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

        <div className="flex w-full mt-4 flex-col gap-2">
          <form
            onSubmit={handleRegister}
            className="flex w-full flex-col gap-4"
          >
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <InputField
                label="First Name"
                placeholder="John"
                value={firstName}
                type="text"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />

              <InputField
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                type="text"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>

            <InputField
              label="Email"
              placeholder="johndoe@example.com"
              value={email}
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <div className="flex flex-col gap-2">
              <InputField
                label="Password"
                placeholder="••••••"
                value={password}
                type="password"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <div className="grid grid-cols-3  items-center justify-start gap-2">
                <div
                  className={`h-1.5 w-full rounded-full ${
                    passwordStrength(password) >= 4
                      ? "bg-primary"
                      : passwordStrength(password) >= 2
                        ? "bg-macro-carbs"
                        : "bg-macro-fat"
                  }`}
                ></div>
                <div
                  className={`h-1.5 w-full rounded-full ${
                    passwordStrength(password) >= 4
                      ? "bg-primary"
                      : passwordStrength(password) >= 2
                        ? "bg-macro-carbs"
                        : "bg-surface-raised"
                  }`}
                ></div>
                <div
                  className={`h-1.5 w-full rounded-full ${passwordStrength(password) >= 4 ? "bg-primary" : "bg-surface-raised"}`}
                ></div>
              </div>

              <p className="text-xs font-bold text-text-muted">
                At least 8 characters required
              </p>
            </div>

            <InputField
              label="Confirm Password"
              placeholder="••••••"
              value={confirmPassword}
              type="password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />

            <div className="flex w-full items-start justify-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="mt-0.5 size-4 accent-primary"
              />
              <label
                htmlFor="terms"
                className="text-sm font-semibold leading-5 text-text-muted"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-bold text-primary transition-colors hover:text-primary-hover"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-bold text-primary transition-colors hover:text-primary-hover"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 h-11 cursor-pointer disabled:cursor-not-allowed disabled:bg-primary/60  rounded-btn bg-primary px-4 text-sm font-bold text-sidebar transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {isLoading ? 
              <span className=" flex items-center justify-center gap-4 ">
                  
                  Creating your account...
                  <RefreshCcw className="animate-spin"/>
              </span>
              : "Create Account"}
            </button>

            <p className="text-sm text-center text-text-subtle mt-2">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-bold text-primary transition-colors hover:text-primary-hover"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
