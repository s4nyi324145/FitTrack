"use client";

import { AddedExericses, AddedExericsesTemplate, Exercise, WorkoutDetail } from "@/types";
import React from "react";
import {
  Dumbbell,
  Plus,
  Cpu,
  User,
  Cable,
  CircleDot,
  Check,
} from "lucide-react";
import { addExerciseToWorkout } from "@/app/actions/workoutsActions";

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

const equipmentConfig: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  barbell: { label: "Barbell", icon: <Dumbbell size={24} /> },
  dumbbell: { label: "Dumbbell", icon: <Dumbbell size={24} /> },
  machine: { label: "Machine", icon: <Cpu size={24} /> },
  bodyweight: { label: "Bodyweight", icon: <User size={24} /> },
  cable: { label: "Cable", icon: <Cable size={24} /> },
  resistance_band: { label: "Resistance Band", icon: <CircleDot size={24} /> },
  kettlebell: { label: "Kettlebell", icon: <Dumbbell size={24} /> },
  other: { label: "Other", icon: <Dumbbell size={24} /> },
};

const InlineExerciseCard = ({
  ex,
  workout_id,
  addedExercises,
  type
}: {
  ex: Exercise;
  workout_id: number;
  addedExercises: AddedExericses[] | AddedExericsesTemplate[];
  type: string
}) => {


  const isAdded = addedExercises.some(
    exercise => exercise.exercise_id === ex.id,
  );

  const handleAddingExercise = async () => {
    if(isAdded) return false
    const order = addedExercises.length 
    await addExerciseToWorkout(workout_id, ex.id, order, type);
  };

  

  return (
    <div
      onClick={() => handleAddingExercise()}
      className="flex flex-1 hover:bg-primary-hover/20 rounded-md cursor-pointer transition-all  items-center justify-between p-2"
    >
      <div className="flex flex-1  gap-4">
        <div
          className={`p-3 rounded-md text-white flex h-full items-center  ${muscleGroupColors[ex.muscle_group.toLocaleLowerCase()].bg}`}
        >
          {equipmentConfig[ex.equipment].icon}
        </div>
        <div className="flex  flex-col">
          <p className="font-bold">{ex.name}</p>
          <p className="text-text-muted">
            {muscleGroupLabel[ex.muscle_group]} -{" "}
            {equipmentConfig[ex.equipment].label}
          </p>
        </div>
        
      </div>

      <div className="flex gap-4 items-center">
        {ex.is_custom && (
          <span className="flex  text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-hover/50 text-primary border border-primary/30">
            Custom
          </span>
        )}

      <div className="bg-primary-hover p-2 text-black rounded-full">
        {isAdded ? (
          <Check size={20} strokeWidth={3} />
        ) : (
          <Plus size={20} strokeWidth={3} />
        )}
      </div>
      </div>
    </div>
  );
};

export default InlineExerciseCard;
