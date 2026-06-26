import React from "react";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { getWorkoutDetail } from "@/lib/queries/workouts";
import Link from "next/link";

import NotesField from "@/components/detailedWorkout/NotesField";
import AddExerciseField from "@/components/detailedWorkout/AddExerciseField";
import { getAllExercise } from "@/lib/queries/exercises";
import ActiveExerciseCard from "@/components/detailedWorkout/ActiveExerciseCard";
import ActiveWorkoutHeader from "@/components/detailedWorkout/ActiveWorkoutHeader";

const ActiveWorkoutPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const workoutDetail = await getWorkoutDetail(parseInt(id));
  const exercises = await getAllExercise();

  if (!workoutDetail || Array.isArray(workoutDetail)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center h-full gap-4 p-8">
        <Dumbbell size={40} className="text-text-muted" />
        <p className="font-semibold text-foreground">Workout not found</p>
        <Link
          href="/workouts"
          className="text-primary text-sm font-semibold hover:underline"
        >
          ← Back to Workouts
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Sticky header */}
      <ActiveWorkoutHeader workoutDetail={workoutDetail} />
      <hr className="border border-border" />

      <div className="flex  flex-col flex-1 justify-between gap-4 p-8">
        <div className="flex gap-4 flex-col">
          <NotesField initialNotes={workoutDetail.notes} />

          {workoutDetail.exercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 bg-surface border border-dashed border-border rounded-xl">
              <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center">
                <Dumbbell size={22} className="text-text-muted" />
              </div>
              <p className="font-semibold text-foreground">No exercises yet</p>
              <p className="text-sm text-text-muted text-center max-w-xs">
                Tap the button below to add your first exercise
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {workoutDetail.exercises.map((ex, index) => (
                <ActiveExerciseCard
                  key={index}
                  workout_id={parseInt(id)}
                  ex={ex}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-end">
          <AddExerciseField
            workoutDetail={workoutDetail}
            exercises={exercises}
            workoutId={workoutDetail.id}
          />
        </div>
      </div>
    </div>
  );
};

export default ActiveWorkoutPage;
