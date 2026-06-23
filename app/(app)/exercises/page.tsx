
import ExerciseList from '@/components/exercisesLibrary/ExerciseList'
import FilterFields from '@/components/exercisesLibrary/FilterFields'
import { getAllExercise } from '@/lib/queries/exercises'
import React from 'react'

const Exercises = async() => {

  const exercises = await getAllExercise()

  return <ExerciseList exercises={exercises}/>
}

export default Exercises
