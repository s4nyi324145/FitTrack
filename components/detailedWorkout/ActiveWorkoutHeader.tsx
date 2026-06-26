"use client"

import React, { useState } from 'react'
import WorkoutTimer from "@/components/detailedWorkout/WorkoutTimer";
import FinisWorkoutBtn from "@/components/detailedWorkout/FinisWorkoutBtn";
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { WorkoutDetail } from '@/types';
import { updateWorkoutName } from '@/app/actions/workoutsActions';
const ActiveWorkoutHeader = ({ workoutDetail }: { workoutDetail: WorkoutDetail }) => {
  const [editName, setEditName] = useState(false)
  const [newName, setNewName] = useState<string>(workoutDetail.name)
  const [isPending, setIsPending] = useState(false)

  const handleSaveWorkoutName = async () => {
    if (!newName.trim()) {
      setNewName(workoutDetail.name)
      setEditName(false)
      return
    }

    setIsPending(true)
    try {
      const result = await updateWorkoutName(workoutDetail.id, newName.trim())
      if (result?.error) {
        setNewName(workoutDetail.name)
      }
    } catch (error) {
      console.log(error)
      setNewName(workoutDetail.name)
    } finally {
      setIsPending(false)
      setEditName(false)
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
        <FinisWorkoutBtn />
      </div>
    </div>
  )
}

export default ActiveWorkoutHeader
