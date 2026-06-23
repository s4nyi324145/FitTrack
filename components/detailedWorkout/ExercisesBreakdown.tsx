// ExercisesBreakdown.tsx
"use client";

import React, { useState } from "react";
import type { WorkoutDetail } from "@/types";
import ExerciseCard from "../detailedWorkout/ExerciseCard";



const ExercisesBreakdown = ({ workoutDetail }: { workoutDetail: WorkoutDetail }) => {
  return (
    <div className="flex gap-4 flex-col">
      <div className="flex gap-3 items-center">
        <p className="font-bold text-lg">Exercise Breakdown</p>
        <span className="font-bold text-text-muted bg-surface-raised border border-border px-3 rounded-full py-0.5 text-xs">
          {workoutDetail.exercises.length} exercises
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {workoutDetail.exercises.map((ex, index) => (
          <ExerciseCard key={index} ex={ex} />
        ))}
      </div>
    </div>
  )
}

export default ExercisesBreakdown;