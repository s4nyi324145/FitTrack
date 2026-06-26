import { Exercise } from "@/types";
import {
  Dumbbell,
  BarChart2,
  Cpu,
  User,
  Cable,
  CircleDot,
  CirclePlus,
} from "lucide-react";
import React from "react";

const muscleGroupColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
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

const equipmentConfig: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  barbell: { label: "Barbell", icon: <Dumbbell size={13} /> },
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

// ExerciseCard.tsx
const ExerciseCard = ({ exercise, onSelect }: { exercise: Exercise; onSelect?: (ex: Exercise) => void }) => {
  const muscle =
    muscleGroupColors[exercise.muscle_group.toLowerCase()] ??
    muscleGroupColors.full_body;
  const equip =
    equipmentConfig[exercise.equipment.toLowerCase()] ?? equipmentConfig.other;

  return (
    <div onClick={() => onSelect?.(exercise)} className="group bg-surface border border-border rounded-xl flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden">
      <div
        className={`relative h-32 flex items-center justify-center ${muscle.bg} shrink-0`}
      >
        <Dumbbell size={40} className={`${muscle.text} opacity-20`} />
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full border ${muscle.bg} ${muscle.text} ${muscle.border}`}
        >
          {muscleGroupLabel[exercise.muscle_group] ?? exercise.muscle_group}
        </span>
        {exercise.is_custom && (
          <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-hover/50 text-primary border border-primary/30">
            Custom
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
            {exercise.name}
          </p>
        </div>

        <hr className="border-border" />

        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border border-border bg-surface-raised text-text-muted min-w-0 max-w-[70%]">
            <span className="shrink-0">{equip.icon}</span>
            <span className="truncate">{equip.label}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Add to workout
            }}
            className="shrink-0 text-primary hover:text-primary-hover transition-colors"
            title="Add to workout"
          >
            <CirclePlus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
