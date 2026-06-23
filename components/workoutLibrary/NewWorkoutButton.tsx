
'use client'

import { createNewWorkout } from "@/app/actions/workoutsActions"

export default function NewWorkoutButton() {
  const handleNewWorkout = async () => {
     const response = await createNewWorkout()
  }

  return (
    <button onClick={handleNewWorkout} className="bg-primary hover:bg-primary-hover transition-all cursor-pointer text-white text-sm p-2 border border-border rounded-md">
      + New Workout
    </button>
  )
}