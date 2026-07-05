import React from 'react'
import Link from 'next/link'
import { MoveLeft } from 'lucide-react'
import { getWorkoutTemplates } from '@/lib/queries/templates'
import  TemplateWorkouts  from '@/components/templetePage/TemplateWorkouts'
const page = async () => {


  const workoutTemplates = await getWorkoutTemplates()


  return (
    <div className='flex flex-1 flex-col gap-5 p-8'>
         <div className="flex items-end     justify-between gap-5 ">
            <div className="flex justify-end  flex-col gap-3">
              <Link href="/workouts" className="flex hover:text-primary text-text-muted text-sm items-center gap-2 w-fit">
                <MoveLeft size={14} />
                <p>Workouts</p>
              </Link>
                <p className=" text-3xl  font-bold">Workout Templates</p>
                <p className="text-text-muted">
                    Create reusable workout plans to stay consistent and track your progress over time.
                </p>
            </div>
            <button className="bg-primary cursor-pointer hover:bg-primary-hover transition-colors hover:text-white flex justify-end font-bold text-md text-green-800 border border-green-800 rounded-md px-4 py-2">+ New Template</button>
         </div>
         <TemplateWorkouts workoutTemplates={workoutTemplates}/>
        
    </div>
  )
}

  


export default page
