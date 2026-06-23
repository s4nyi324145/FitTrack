import WorkoutList from '@/components/workoutLibrary/WorkoutList'
import { getRecentWorkouts } from '@/lib/queries/workouts'
import React from 'react'
import type { RecentWorkout } from '@/types'

const Workouts = async () => {

  const workouts = await getRecentWorkouts()
  console.log(workouts);
  
  
  return <WorkoutList workouts={workouts}/>

}

export default Workouts
