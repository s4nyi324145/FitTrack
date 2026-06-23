'use client'

import React, { useState } from 'react'
import type { Exercise, WorkoutDetail } from '@/types'
import { CirclePlus } from 'lucide-react'
import AddExerciseModal from './AddExerciseModal'
const AddExerciseField = ({workoutId, exercises, workoutDetail}: {workoutId:number, exercises: Exercise[], workoutDetail: WorkoutDetail }) => {

  const [showExercises, setShowExercises] = useState<boolean>(false)

  return (

    <>
      {showExercises && <AddExerciseModal workoutDetail={workoutDetail} setShowExercises={setShowExercises} workoutId={workoutId} exercises={exercises}/>}


      <div onClick={() => setShowExercises(true)} className='flex  flex-1 group transition-all cursor-pointer text-primary-hover gap-4 items-center mt-7 rounded-md justify-center border-3 p-4 border-primary-hover border-dashed'>
        <CirclePlus className='group' size={30} />
          <p className='text-lg group font-bold'>Add Exercise</p>
      </div>
    
    
    </>
  )
}

export default AddExerciseField
