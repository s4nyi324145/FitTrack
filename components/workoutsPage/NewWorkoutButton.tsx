
'use client'

import { createNewWorkout } from "@/app/actions/workoutsActions"
import { useToast } from "@/app/context/toastContext"
import { useState } from "react"

type Prop = {
  hasActiveWorkout: boolean
}

export default function NewWorkoutButton({hasActiveWorkout}: Prop) {

  const [loading, setLoading] = useState(false)
  const {showError, showSuccess} = useToast()

  const handleNewWorkout = async () => {

    setLoading(true)

    if(hasActiveWorkout){
      showError("You already have an active workout. Please finish it before starting a new one.")
      setLoading(false)
      return
    }

    try {
      const result = await createNewWorkout(hasActiveWorkout)
      if(result.error){
          return showError(result.error)
      }
      showSuccess("Workout created successfully")
    }
    catch (error) {
      showError("Server error")
    } 
    finally {
      setLoading(false)
    }
   

    }


  return (
    <button onClick={handleNewWorkout} disabled={loading} className="bg-primary hover:bg-primary-hover transition-all cursor-pointer text-white text-sm p-2 border border-border rounded-md">
      {loading ? "Creating..." : "+ New Workout"}
    </button>
  )
}