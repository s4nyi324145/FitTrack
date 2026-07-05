
import WorkoutStats from "./WorkoutStats";
import RecentWorkouts from "./RecentWorkouts";
import type { RecentWorkout } from "@/types";
import NewWorkoutButton from "./NewWorkoutButton";
import ActiveWorkouts from "./ActiveWorkouts";
import Link from "next/link";
const WorkoutList = ({workouts}: {workouts: RecentWorkout[]}) => {

  const activeWorkouts: RecentWorkout[] | null = workouts.filter(w => w.finished_at === null)
    
  return (
    <div className="flex flex-1 flex-col gap-5 p-8">
      <div className="flex mb-7 gap-4  w-full items-end flex-wrap justify-between">
        <div className="flex  flex-col gap-3">
          <p className=" text-3xl  font-bold">Workouts</p>
          <p className="text-text-muted">
            Track your traning sessions and monitor progress
          </p>
        </div>
        <div className="flex gap-3">
                <Link href={'workouts/templates'} className="bg-background text-sm px-2 py-2 border border-border rounded-md">
                    Templates
                </Link>
                <NewWorkoutButton hasActiveWorkout={activeWorkouts.length != 0}/>
        </div>
      </div>
      <WorkoutStats/>
      {activeWorkouts.length > 0  && <ActiveWorkouts workouts={activeWorkouts}/> }
      <RecentWorkouts workouts={workouts.filter(w => w.finished_at !== null)}/>
    </div>
  );
};

export default WorkoutList;
