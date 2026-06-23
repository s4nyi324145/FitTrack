"use client";

import React from "react";
import InputField from "../shared/InputField";
import { Info } from "lucide-react";
import type { OnboardingData } from "@/app/onboarding/page";

type Props = {
  data: OnboardingData;
  update: (fields: Partial<OnboardingData>) => void;
};

const units = ["Metric", "Imperial"] as const;

const BodyMeasurements = ({ data, update }: Props) => {
  const isMetric = data.units === "Metric";

  return (
    <div className="flex flex-col gap-8 bg-surface p-6 md:p-12 rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <h2 className="text-2xl md:text-4xl text-foreground font-bold">
            Your body measurements
          </h2>
          <p className="text-text-muted text-sm md:text-base">
            Precision is the key to athletic results
          </p>
        </div>

        {/* Unit toggle */}
        <div className="flex p-1 rounded-full gap-1 bg-text-muted/20 self-start">
          {units.map((u) => (
            <div
              key={u}
              onClick={() => update({ units: u })}
              className={`transition-colors uppercase font-bold px-3 py-1 cursor-pointer rounded-full text-xs ${
                data.units === u
                  ? "bg-surface text-primary"
                  : "text-text-muted hover:text-foreground"
              }`}
            >
              {u}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <InputField
            label={`Height (${isMetric ? "cm" : "ft"})`}
            placeholder={isMetric ? "180" : "5.11"}
            value={data.height}
            type="number"
            onChange={(e) => update({ height: e.target.value })}
          />
          <InputField
            label={`Weight (${isMetric ? "kg" : "lbs"})`}
            placeholder={isMetric ? "75" : "165"}
            value={data.weight}
            type="number"
            onChange={(e) => update({ weight: e.target.value })}
          />
        </div>

        <InputField
          label={`Target Weight (${isMetric ? "kg" : "lbs"})`}
          placeholder={isMetric ? "70" : "154"}
          value={data.targetWeight}
          type="number"
          onChange={(e) => update({ targetWeight: e.target.value })}
        />

        <div className="bg-primary/10 flex p-3 items-center gap-3 rounded-md">
          <Info className="text-primary shrink-0" size={18} />
          <p className="text-primary text-sm font-semibold">
            Setting realistic targets improves consistency and health outcomes
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodyMeasurements;