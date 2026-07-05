import WorkoutList from '@/components/workoutsPage/WorkoutList'
import { getRecentWorkouts } from '@/lib/queries/workouts'

const Workouts = async () => {

  const workouts = await getRecentWorkouts()
    
  return <WorkoutList workouts={workouts}/>

}

export default Workouts
