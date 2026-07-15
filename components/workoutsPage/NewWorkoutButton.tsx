
'use client'

import { createNewWorkout } from "@/app/actions/workoutsActions"
import { useToast } from "@/app/context/toastContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Prop = {
  hasActiveWorkout: boolean
}

export default function NewWorkoutButton({hasActiveWorkout}: Prop) {

  const [loading, setLoading] = useState(false)
  const {showError, showSuccess} = useToast()
  const router = useRouter()

const handleNewWorkout = async () => {
  
  if (hasActiveWorkout) {
    showError("You already have an active workout. Please finish it before starting a new one.");
    return;
  }

  setLoading(true);

  try {
    const result = await createNewWorkout();


    if (result?.error) {
      showError(result.error);
      return; 
    }


    if (result?.workoutId) {
      showSuccess("Workout created successfully");
      router.refresh();
      router.push(`/workouts/${result.workoutId}/active`);
    } else {
      showError("Failed to retrieve new workout ID.");
    }

  } catch (error) {
    console.error("New workout error:", error);
    showError("Server error");
  } finally {

    setLoading(false);
  }
};


  return (
    <button onClick={handleNewWorkout} disabled={loading} className="bg-primary hover:bg-primary-hover transition-all cursor-pointer text-white text-sm p-2 border border-border rounded-md">
      {loading ? "Creating..." : "+ New Workout"}
    </button>
  )
}