"use client"

import React, { useState } from 'react'
import WorkoutTimer from "@/components/workoutDetails/WorkoutTimer";
import FinisWorkoutBtn from "@/components/workoutDetails/FinisWorkoutBtn";
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { WorkoutDetail } from '@/types';
import { finishWorkout, updateWorkoutName } from '@/app/actions/workoutsActions';
import {useToast} from '@/app/context/toastContext';
import { useRouter } from 'next/navigation';

const ActiveWorkoutHeader = ({ workoutDetail }: { workoutDetail: WorkoutDetail }) => {
  const [editName, setEditName] = useState(false)
  const [newName, setNewName] = useState<string>(workoutDetail.name)
  const [isPending, setIsPending] = useState(false)

  const {showError, showSuccess} = useToast()

  const router = useRouter()

  const handleSaveWorkoutName = async () => {


    if (!newName.trim()) {
      setNewName(workoutDetail.name)
      setEditName(false)
      showError("Workout name cannot be empty")
      return
    }

    setIsPending(true)
    try {
      const result = await updateWorkoutName(workoutDetail.id, newName.trim())
      if (result?.error) {
        setNewName(workoutDetail.name)
        showError(result.error)
        return
      }

      showSuccess("Workout name updated successfully")

    } catch (error) {
      setNewName(workoutDetail.name)
      showError("Failed to update workout name")
    } finally {
      setIsPending(false)
      setEditName(false)
    }
  }

  const handleFinishWorkout = async () => {


    setIsPending(true)
    

    try {

      const allSets = workoutDetail.exercises.flatMap(ex => ex.sets) // Flatten all sets from all exercises
      const completedSets = allSets.filter(s => s.completed)

      const totalVolume = completedSets.reduce((acc, s) => acc + (Number(s.weight) * (s.reps ?? 0)), 0)
      const totalSets = completedSets.length

      const result = await finishWorkout(workoutDetail.id,workoutDetail.started_at, totalVolume, totalSets)

      if (result?.error) {
        showError(result.error)
        return
      }

      if (result?.success) {
        showSuccess("Workout finished successfully")
        router.push("/workouts")
        
      }
      
      
    } catch (error) {
      console.log(error)
      showError("Failed to finish workout")
      
    }
    finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center px-8 py-5 gap-2 justify-between sticky top-0 bg-background z-10">
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/workouts" className="text-foreground hover:text-primary transition-colors shrink-0">
          <ArrowLeft />
        </Link>

        {editName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              disabled={isPending}
              className="font-bold text-2xl outline-none bg-transparent border-b-2 border-primary min-w-0 disabled:opacity-50"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveWorkoutName()
                if (e.key === "Escape") {
                  setNewName(workoutDetail.name)
                  setEditName(false)
                }
              }}
            />
            <button
              onClick={handleSaveWorkoutName}
              disabled={isPending}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 shrink-0"
            >
              <Check size={14} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <p
            onClick={() => setEditName(true)}
            className="text-2xl font-bold truncate cursor-pointer hover:text-primary transition-colors"
          >
            {workoutDetail.name}
          </p>
        )}
      </div>

      <div className="flex gap-4 shrink-0">
        <WorkoutTimer started_at={workoutDetail.started_at} />
        <button disabled={isPending} onClick={() => handleFinishWorkout()} className='flex bg-primary cursor-pointer hover:bg-primary-hover rounded-md items-center px-4 font-bold text-white'>
        <p>
          {isPending ? "Finishing..." : "Finish Workout"}  
        </p>
         </button>
      </div>
    </div>
  )
}

export default ActiveWorkoutHeader
