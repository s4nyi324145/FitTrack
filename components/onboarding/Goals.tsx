"use client";

import React from "react";
import { Flame, Dumbbell, Scale } from "lucide-react";
import type { OnboardingData } from "@/app/onboarding/page";

type Props = {
  data: OnboardingData;
  update: (fields: Partial<OnboardingData>) => void;
};

const goals = [
  { goal: "Lose weight",   icon: <Flame size={20} />,   desc: "Burn fat and improve definition" },
  { goal: "Build muscle",  icon: <Dumbbell size={20} />, desc: "Increase strength and hypertrophy" },
  { goal: "Stay in shape", icon: <Scale size={20} />,    desc: "Maintain current physique and health" },
];

const Goals = ({ data, update }: Props) => {
  return (
    <div className="flex flex-col gap-8 bg-surface p-6 md:p-12 rounded-md">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-4xl text-foreground font-bold">
          What's your main goal?
        </h2>
        <p className="text-text-muted text-sm md:text-base">
          We'll adjust your macros based on this choice.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {goals.map((item) => (
          <div
            key={item.goal}
            onClick={() => update({ goal: item.goal })}
            className={`flex flex-1 p-4 cursor-pointer transition-colors items-center justify-between gap-4 border-2 rounded-md ${
              data.goal === item.goal
                ? "border-primary bg-primary/10"
                : "border-text-muted/10 hover:border-text-muted/40"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 transition-colors ${
                data.goal === item.goal
                  ? "text-primary bg-primary/10"
                  : "text-text-muted bg-text-muted/20"
              }`}>
                {item.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-foreground font-semibold">{item.goal}</p>
                <p className="text-text-subtle text-sm">{item.desc}</p>
              </div>
            </div>

            <div className={`w-6 h-6 border-2 flex items-center justify-center rounded-full shrink-0 transition-colors ${
              data.goal === item.goal
                ? "bg-primary border-primary text-white"
                : "border-text-muted/30"
            }`}>
              {data.goal === item.goal && <span className="text-xs font-bold">✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;