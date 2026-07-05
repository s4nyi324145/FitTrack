"use client"
import React, { useEffect, useState } from 'react'
import ActiveExerciseCard from './ActiveExerciseCard'
import { WorkoutDetail } from '@/types'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { updateExerciseOrder } from '@/app/actions/workoutsActions'

type Props = {
    workoutDetail: WorkoutDetail
}

const ActiveExercisesList = ({workoutDetail}: Props) => {

  const [exercises, setExercises] = useState(workoutDetail.exercises)

  useEffect(() => {setExercises(workoutDetail.exercises)}, [workoutDetail.exercises])

  const handleUpdateOrder = async (exerciseIds: number[]) => {
    try {
        const result = await updateExerciseOrder(workoutDetail.id, exerciseIds)
        if (result?.error) {
            console.error(result.error)
        }
    } catch (error) {
        console.log(error);
    }
}

  return (
    <div className="flex flex-col   gap-3">
        <DragDropProvider
            onDragEnd={(event) => {
                if(event.canceled) return;
                const {source} = event.operation

                if(isSortable(source)) {
                    const {initialIndex, index} = source
                    if(initialIndex !== index) {
                           const updated = [...exercises]
                         const [moved] = updated.splice(initialIndex,1)
                         updated.splice(index,0,moved)

                         setExercises(updated)

                         const freshIds = updated.map(ex => ex.id)
                         handleUpdateOrder(freshIds)
                            //TODO: finish the amit elkezdtem
                        
                    }


                }
            }}
        >
              {exercises.map((ex) => (
                <ActiveExerciseCard
                  key={ex.id}
                  workout_id={workoutDetail.id}
                  ex={ex}
                
                />
              ))}
        </DragDropProvider>
    </div>
  )
}

export default ActiveExercisesList
