import React from "react";
import type { Exercise, PersonalRecord } from "@/types";

import {X,Dumbbell,Cpu,User,Cable,CircleDot,BarChart2,} from "lucide-react";
import { getPrsByExId } from "@/lib/queries/personalRecords";

type Props = {
  exercise: Exercise;
  onClose: () => void;
  prs: PersonalRecord[]
};

const muscleGroupColors: Record<string,{ bg: string; text: string; border: string }> = {
  chest: { bg: "bg-blue-500", text: "text-white", border: "border-blue-600" },
  back: {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-600",
  },
  shoulders: {
    bg: "bg-yellow-500",
    text: "text-white",
    border: "border-yellow-600",
  },
  biceps: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-600",
  },
  triceps: {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-600",
  },
  legs: { bg: "bg-red-500", text: "text-white", border: "border-red-600" },
  glutes: { bg: "bg-pink-500", text: "text-white", border: "border-pink-600" },
  core: { bg: "bg-cyan-500", text: "text-white", border: "border-cyan-600" },
  cardio: { bg: "bg-rose-500", text: "text-white", border: "border-rose-600" },
  full_body: {
    bg: "bg-teal-500",
    text: "text-white",
    border: "border-teal-600",
  },
};

const prsLabels: Record<string,{ label: string; sub: string; unit: string }> = {
      max_weight: {
        label: "Max Weight",
        sub: "Best single set",
        unit: "kg",
      },
      max_reps: {
        label: "Max Reps",
        sub: "Most reps in a set",
        unit: "",
      },
      est_1rm: {
        label: "Est. 1RM",
        sub: "Epley formula",
        unit: "kg",
      },
  };
  
 


const equipmentConfig: Record<string,{ label: string; icon: React.ReactNode }> = {
  barbell: { label: "Barbell", icon: <BarChart2 size={13} /> },
  dumbbell: { label: "Dumbbell", icon: <Dumbbell size={13} /> },
  machine: { label: "Machine", icon: <Cpu size={13} /> },
  bodyweight: { label: "Bodyweight", icon: <User size={13} /> },
  cable: { label: "Cable", icon: <Cable size={13} /> },
  resistance_band: { label: "Resistance Band", icon: <CircleDot size={13} /> },
  kettlebell: { label: "Kettlebell", icon: <Dumbbell size={13} /> },
  other: { label: "Other", icon: <Dumbbell size={13} /> },
};

const muscleGroupLabel: Record<string, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  legs: "Legs",
  glutes: "Glutes",
  core: "Core",
  cardio: "Cardio",
  full_body: "Full Body",
};

const ExerciseDetailModal = ({ exercise, onClose, prs }: Props) => {

  const muscle = muscleGroupColors[exercise.muscle_group] ?? muscleGroupColors.full_body;
  const equip = equipmentConfig[exercise.equipment] ?? equipmentConfig.other;
  const tipsArray = exercise.tips?.split("-").map((t) => t.trim()).filter(Boolean);



  
  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="flex flex-col bg-surface max-w-[680px] w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
    
        <div
          className={`relative flex flex-col justify-between p-5 ${muscle.bg} rounded-t-xl min-h-[140px]`}
        >
         
          <Dumbbell
            size={120}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white opacity-10"
          />

       
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-wide">
              {muscleGroupLabel[exercise.muscle_group] ?? exercise.muscle_group}
            </span>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
                {equip.icon}
                {equip.label}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 z-10 cursor-pointer flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X size={14} className="cursor-pointer"/>
              </button>
            </div>
          </div>

        
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-white leading-tight">
              {exercise.name}
            </h2>
            {exercise.name_hu && (
              <p className="text-sm text-white/70 mt-0.5">{exercise.name_hu}</p>
            )}
          </div>
        </div>

      
        <div className="flex flex-col md:flex-row gap-6 p-6">
         
          <div className="flex flex-col gap-5 flex-[0.55]">
          
            <div className="flex flex-col gap-2">
              <p className="uppercase text-xs font-bold text-text-muted tracking-wider">
                Instructions
              </p>
              {exercise.instructions ? (
                <p className="text-sm text-foreground leading-relaxed">
                  {exercise.instructions}
                </p>
              ) : (
                <p className="text-sm text-text-muted italic">
                  No instructions available yet.
                </p>
              )}
            </div>

            {tipsArray && tipsArray.length > 0 && (
              <div className="flex flex-col gap-2 bg-primary/10 border border-primary/20 rounded-md p-4">
                <p className="uppercase text-xs font-bold text-primary tracking-wider">
                  Pro Tips
                </p>
                <ol className="flex flex-col gap-2 list-decimal list-inside">
                  {tipsArray.map((tip, index) => (
                    <li
                      key={index}
                      className="text-sm text-foreground font-medium"
                    >
                      {tip}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {exercise.is_custom && (
              <div className="flex">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  ✓ Custom exercise
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 flex-[0.45]">
            <p className="uppercase text-xs font-bold text-text-muted tracking-wider">
              Personal Records
            </p>

            {prs.map((pr: {record_type: string, value: number}) => {

              const sPr =  prsLabels[pr.record_type] 

            return(
              <div
                key={sPr.label}
                className="flex items-center justify-between bg-surface-raised border border-border rounded-md px-4 py-3"
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-bold text-foreground">{sPr.label}</p>
                  <p className="text-xs text-text-muted">{sPr.sub}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-foreground">
                    {pr.value ?? "—"}
                  </span>
                  {sPr.unit && (
                    <span className="text-xs text-text-muted font-semibold">
                      {sPr.unit}
                    </span>
                  )}
                </div>
              </div>
            )
  })}
          </div>
        </div>


        <div className="flex flex-col gap-2 px-6 pb-6">
          <button className="w-full cursor-pointer bg-primary hover:bg-primary-hover transition-colors text-white font-bold rounded-md py-3 text-sm">
            + Add to Workout
          </button>
          <p className="text-xs text-center text-text-muted">
            Select a workout first to add this exercise
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;
