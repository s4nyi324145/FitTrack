"use client";

import React from "react";
import type { OnboardingData } from "@/app/onboarding/page";

type Props = {
  data: OnboardingData;
  update: (fields: Partial<OnboardingData>) => void;
};

const genders = ["Male", "Female", "Other"];

const BasicInfo = ({ data, update }: Props) => {
  return (
    <div className="flex flex-col gap-8 bg-surface p-6 md:p-12 rounded-md">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-4xl text-foreground font-bold">
          Tell us about yourself
        </h2>
        <p className="text-text-muted text-sm md:text-base">
          This will help us create a personalized experience for you.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-muted">Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={data.name}
            onChange={(e) => update({ name: e.target.value })}
            className="h-11 w-full rounded-btn border border-border bg-surface-raised px-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-muted">Date of Birth</label>
          <div className="flex gap-2">
            <select
              value={data.day}
              onChange={(e) => update({ day: e.target.value })}
              className="h-11 w-full rounded-btn border border-border bg-surface-raised px-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <select
              value={data.month}
              onChange={(e) => update({ month: e.target.value })}
              className="h-11 w-full rounded-btn border border-border bg-surface-raised px-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <select
              value={data.year}
              onChange={(e) => update({ year: e.target.value })}
              className="h-11 w-full rounded-btn border border-border bg-surface-raised px-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-muted">Gender</label>
          <div className="flex bg-text-muted/20 p-1 rounded-md gap-1">
            {genders.map((gender) => (
              <div
                key={gender}
                onClick={() => update({ gender })}
                className={`flex flex-1 justify-center cursor-pointer transition-colors rounded-md px-4 py-2 text-sm font-semibold ${
                  data.gender === gender
                    ? "bg-surface text-primary"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                {gender}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;