"use client"
import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import InputField from '@/components/shared/InputField'
import AddExerciseField from '@/components/workoutDetails/AddExerciseField'
import { Exercise, TemplateWorkout } from '@/types'
import TemplateExercisesCard from '../templetePage/TemplateExercisesCard'

type Prop = {
    exercises: Exercise[],
    templateData: TemplateWorkout
}

const TemplateData = ({exercises, templateData}: Prop) => {

 
  const [templateDataS, setTemplateDataS] = useState<TemplateWorkout>(templateData)


  
  useEffect(() => {console.log(templateDataS);
  }, [templateDataS])
  


  return (
    <div className='flex flex-1 flex-col  gap-5'>
         <div className="flex items-center bg-surface border-b-2 border-border justify-around  gap-5 p-5 ">
            <div className="flex items-center gap-3">
                <Link href="/workouts/templates" className="flex hover:text-primary-hover text-primary text-md items-center gap-2 w-fit">
                    <ArrowLeft size={20}  />
                    <p className=" text-md">Templates</p>
                  </Link>
                   <p className=" text-xl  font-bold">{templateDataS.template_name}</p>
            </div>
            <button className="bg-primary cursor-pointer hover:bg-primary-hover transition-colors hover:text-white flex justify-end font-bold text-sm text-green-800 border border-green-800 rounded-full px-4 py-2">Save Template</button>
           
          </div>

          <div className="flex   flex-col gap-5 p-5">
            <div className="flex bg-surface border border-border rounded-md p-4  gap-4">
                 <div className='flex flex-1'>
                      <InputField label='Template Name' placeholder='e.g Push Day (A)' type='text' value={templateDataS.template_name ?? ""} onChange={() => {}}  />
                 </div>
                 <div className='flex flex-1'>
                      <InputField label='Notes' placeholder='Describe this template...' type='text' value={templateDataS.template_notes ?? ""} onChange={() => {}}  />
                 </div>
            </div>

            <div className='flex gap-2'>
              <p className='font-bold text-xl'>Exercises</p>
              <p className='font-bold text-xl'>({templateData.exercises.length})</p>
            </div>

            <div className='flex flex-col flex-1 gap-4'>
                {templateData.exercises.map((e) => 
                  <TemplateExercisesCard exercise={e}/>
                
                )}
            </div>

            

            <AddExerciseField workoutId={templateData.template_id} exercises={exercises} addedExercises={templateData.exercises}/>
          </div>
          
          
    </div>
  )
}

export default TemplateData
