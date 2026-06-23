import React from "react";
import Image from "next/image";
import googleIcon from "@/public/google-icon.svg";
import { doSocialLogin } from "@/lib/utils/authentication";
import githubIcon from "@/public/github-icon.svg";

const OAuthButtons = () => {
  return (
    <form action={doSocialLogin} className="mt-4 flex w-full flex-col gap-2">
      <button
        type="submit"
        name="action"
        value="github"
        className="flex h-11 cursor-pointer items-center justify-center gap-3 rounded-btn border border-border bg-surface-raised px-4 text-center text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <Image src={githubIcon} alt="GitHub Icon" className="w-5 " />
        <p>Continue with GitHub</p>
      </button>
      <button
        type="submit"
        name="action"
        value="google"
        className="flex h-11 cursor-pointer items-center justify-center gap-3 rounded-btn border border-border bg-surface-raised px-4 text-center text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <Image src={googleIcon} alt="Google Icon" className="w-5" />
        <p>Continue with Google</p>
      </button>
    </form>
  );
};

export default OAuthButtons;
