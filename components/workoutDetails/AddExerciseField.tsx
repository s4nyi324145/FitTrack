"use client";

import React, { useState } from "react";
import type {
  AddedExericses,
  AddedExericsesTemplate,
  Exercise,
  WorkoutDetail,
} from "@/types";
import { CirclePlus } from "lucide-react";
import AddExerciseModal from "./AddExerciseModal";
const AddExerciseField = ({
  workoutId,
  exercises,
  addedExercises,
  type
}: {
  workoutId: number;
  exercises: Exercise[];
  addedExercises: AddedExericses[] | AddedExericsesTemplate[];
  type: string
}) => {
  const [showExercises, setShowExercises] = useState<boolean>(false);

  return (
    <>
      {showExercises && (
        <AddExerciseModal
          addedExercises={addedExercises}
          setShowExercises={setShowExercises}
          workoutId={workoutId}
          exercises={exercises}
          type={type}
        />
      )}

      <div
        onClick={() => setShowExercises(true)}
        className="flex flex-1 hover:scale-105 w-full transform transition-all duration-200 cursor-pointer text-primary-hover gap-4 items-center rounded-md justify-center border-3 p-4 border-primary-hover border-dashed"
      >
        <CirclePlus className="group  transform transition-all" size={30} />
        <p className="text-lg group font-bold">Add Exercise</p>
      </div>
    </>
  );
};

export default AddExerciseField;
