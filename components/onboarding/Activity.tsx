"use client";

import React from "react";
import type { OnboardingData } from "@/app/onboarding/page";
import CalorieGoal from "./CalorieGoal";
import OnBoardingPage from "@/app/onboarding/page";

type Props = {
  data: OnboardingData;
  update: (fields: Partial<OnboardingData>) => void;
};

const activityOptions = [
  { title: "Sedentary",          desc: "Office work, little exercise" },
  { title: "Lightly active",     desc: "1–3 workouts / week" },
  { title: "Moderately active",  desc: "3–5 workouts / week" },
  { title: "Very active",        desc: "Hard exercise daily" },
];

const Activity = ({ data, update }: Props) => {
  return (
    <div className="flex flex-col gap-8 bg-surface p-6 md:p-12 rounded-md">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-4xl text-foreground font-bold">
          How active are you?
        </h2>
        <p className="text-text-muted text-sm md:text-base">
          Outside of your planned workouts.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {activityOptions.map((act) => (
          <div
            key={act.title}
            onClick={() => update({ activityLevel: act.title })}
            className={`flex cursor-pointer border-2 items-center justify-between p-4 rounded-md transition-colors ${
              data.activityLevel === act.title
                ? "border-primary bg-primary/10"
                : "border-text-muted/10 hover:border-text-muted/40 hover:bg-text-muted/5"
            }`}
          >
            <p className={`font-semibold text-sm ${data.activityLevel === act.title ? "text-primary" : "text-foreground"}`}>
              {act.title}
            </p>
            <p className="text-text-subtle text-sm">{act.desc}</p>
          </div>
        ))}
      </div>

      <CalorieGoal data={data}/>
    </div>
  );
};

export default Activity;