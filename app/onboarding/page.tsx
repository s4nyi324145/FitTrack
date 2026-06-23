"use client";

import React, { useState } from "react";
import BasicInfo from "@/components/onboarding/BasicInfo";
import BodyMeasurements from "@/components/onboarding/BodyMeasurements";
import Goals from "@/components/onboarding/Goals";
import Activity from "@/components/onboarding/Activity";
import { completeOnBoarding } from "../actions/onboarding";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export type OnboardingData = {
  // BasicInfo
  name: string;
  day: string;
  month: string;
  year: string;
  gender: string;
  // BodyMeasurements
  units: "Metric" | "Imperial";
  height: string;
  weight: string;
  targetWeight: string;
  // Goals
  goal: string;
  // Activity
  activityLevel: string;
};

const initialData: OnboardingData = {
  name: "",
  day: "",
  month: "",
  year: "",
  gender: "Male",
  units: "Metric",
  height: "",
  weight: "",
  targetWeight: "",
  goal: "Lose weight",
  activityLevel: "Sedentary",
};

const steps = [
  { label: "About you" },
  { label: "Your Body" },
  { label: "Your Goal" },
  { label: "Activity Level" },
];

export default function OnBoardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);

  const {update: updateSession} = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)



  const update = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleFinish = async () => {

    setIsLoading(true)
    console.log("Onboarding data:", data);

    if(!data.activityLevel || !data.day || !data.gender || !data.goal || !data.height || !data.month || !data.name || !data.targetWeight || !data.units || !data.weight || !data.year){
      setError("Please fill out every option")
      setIsLoading(false)
      return 
    }

    try {
       const dbResult = await completeOnBoarding(data)

       if(dbResult?.error) {
        alert(dbResult.error)
        setIsLoading(false)
        return
       }

       await updateSession({
  
          onboarded: true,
        
      });
       router.push("/dashboard")
       router.refresh()

    } catch (error) {
      console.error("Onboarding kliens hiba:", error);
      setIsLoading(false);
    }

  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <BasicInfo data={data} update={update} />;
      case 2: return <BodyMeasurements data={data} update={update} />;
      case 3: return <Goals data={data} update={update} />;
      case 4: return <Activity data={data} update={update} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sidebar p-5">
      <div className="flex items-center justify-between font-bold">
        <h1 className="text-3xl">FitTracker</h1>
        <p className="cursor-pointer text-sm hover:text-primary">Help</p>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-8 rounded-xl p-6 shadow-sm">
        {/* Progress bar */}
        <div className="flex flex-col gap-4">
          <div className="grid w-full grid-cols-4 gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-colors ${
                  currentStep >= index + 1 ? "bg-primary" : "bg-text-muted/20"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-md text-primary uppercase font-semibold">
              {steps[currentStep - 1].label}
            </h2>
            <p className="text-sm text-text-muted">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>

           {error && <p className="text-red-500 font-bold text-sm bg-red-500/10 p-2 rounded">{error}</p>}

        {renderStep()}

        {/* Navigation */}
        <div className="flex w-full items-center justify-end gap-4">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="rounded-md border-2 border-border/20 px-4 py-2 text-sm font-bold text-text-muted hover:border-border/50 transition-colors"
            >
              Back
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-background hover:bg-primary-hover transition-colors"
            >
              Next
            </button>
          ) : (
            <button
    onClick={handleFinish}
    disabled={isLoading}
    className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-background hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? "Saving..." : "Let's go →"}
  </button>
          )}
        </div>
      </div>
    </div>
  );
}