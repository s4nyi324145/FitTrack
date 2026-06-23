"use client";

import React from "react";
import type { InputFieldProps } from "@/types";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  label,
  placeholder,
  value,
  type,
  onChange,
  showPassword,
  setShowPassword,
}: InputFieldProps) => {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label className="text-sm font-semibold text-text-muted">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-btn border border-border bg-surface-raised px-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
        />
        {type === "password" && label === "Password" && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword?.(!showPassword)}
            className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-btn text-text-muted transition-colors hover:bg-surface hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
