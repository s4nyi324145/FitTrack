
import ExerciseList from '@/components/exercisesPage/ExerciseList'
import FilterFields from '@/components/exercisesPage/FilterFields'
import { getAllExercise } from '@/lib/queries/exercises'
import React from 'react'

const Exercises = async() => {

  //TODO : make the design banner for the exercise page

  const exercises = await getAllExercise()

  return <ExerciseList exercises={exercises}/>
}

export default Exercises
