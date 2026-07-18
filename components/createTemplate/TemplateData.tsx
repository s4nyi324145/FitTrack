"use client"
import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import InputField from '@/components/shared/InputField'
import AddExerciseField from '@/components/workoutDetails/AddExerciseField'
import { Exercise, TemplateWorkout } from '@/types'
import TemplateExercisesCard from '../templetePage/TemplateExercisesCard'
import { editTemplateById } from '@/app/actions/templateActions'
import { useToast } from '@/app/context/toastContext'
import { DragDropProvider } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'

type Prop = {
    exercises: Exercise[],
    templateData: TemplateWorkout
}

const TemplateData = ({exercises, templateData}: Prop) => {

 
  const [templateDataS, setTemplateDataS] = useState<TemplateWorkout>(templateData)
  const [isChanged, setIsChanged] = useState(false)
  const {showSuccess, showError} = useToast()

  
  useEffect(() => {console.log(templateDataS);
  }, [templateDataS])

  const update = (fields: Partial<TemplateWorkout>) => {
      if(!isChanged) setIsChanged(true)
      setTemplateDataS((prev) => ({...prev, ...fields}))
  }

  const handleEditTemplate = async () => {

    if(!isChanged) return null
    if(templateDataS.template_name.trim() === "") return showError("Template name can not be empty")

    try {
      
       const result = await editTemplateById(templateData.template_id, templateDataS.template_name, templateDataS.template_notes)

       if(result?.error) showError(result.error)
        if(result.succes) showSuccess("Template updated succesfully")
    } catch (error) {
      showError("Server error")
    }
    finally{
      setIsChanged(false)
    }

  }
  


  return (
    <div className='flex flex-1 flex-col  gap-5'>
         <div className="flex items-center bg-surface border-b-2 border-border justify-between  gap-5 p-5 ">
            <div className="flex items-center gap-3">
                <Link href="/workouts/templates" className="flex hover:text-primary-hover text-primary text-md items-center gap-2 w-fit">
                    <ArrowLeft size={20}  />
                    <p className=" text-md">Templates</p>
                  </Link>
                   <p className=" text-xl  font-bold">{templateDataS.template_name}</p>
            </div>
            <button onClick={handleEditTemplate} disabled={!isChanged} className={` cursor-pointer ${!isChanged ? "bg-green-900" : "bg-primary"}   hover:bg-primary-hover transition-colors hover:text-white flex justify-end font-bold text-sm text-green-800 border border-green-800 rounded-full px-4 py-2`}>Save Template</button>
           
          </div>

          <div className="flex   flex-col gap-5 p-5">
            <div className="flex bg-surface border border-border rounded-md p-4  gap-4">
                 <div className='flex flex-1'>
                      <InputField label='Template Name' placeholder='e.g Push Day (A)' type='text' value={templateDataS.template_name ?? ""} onChange={(e) => update({template_name: e.target.value})}  />
                 </div>
                 <div className='flex flex-1'>
                      <InputField label='Notes' placeholder='Describe this template...' type='text' value={templateDataS.template_notes ?? ""} onChange={(e) => update({template_notes: e.target.value})}  />
                 </div>
            </div>

            <div className='flex gap-2'>
              <p className='font-bold text-xl'>Exercises</p>
              <p className='font-bold text-xl'>({templateData.exercises.length})</p>
            </div>

            <div className='flex flex-col flex-1 gap-4'>
                <DragDropProvider onDragEnd={(event) => {
                  if(event.canceled) return null

                  const {source} = event.operation

                  if(isSortable(source)) {
                    const {initialIndex, index} = source
                    const updated = [...templateDataS.exercises]
                    const [moved] = updated.splice(initialIndex,1)
                    updated.splice(index,0,moved)

                    const reoreded = updated.map((ex,i) => ({...ex, sort_order: i}))

                    setTemplateDataS((prev) => ({
                    ...prev,
                    exercises: reoreded
                  }));
                  if (!isChanged) setIsChanged(true);

                  }
                  //TODO: updated the orders in database

                }}>
                    {templateDataS.exercises.map((e,index) => 
                    <TemplateExercisesCard index={index} key={e.template_exercise_id} exercise={e}/>
                  
                  )}
                </DragDropProvider>
            </div>

            

            <AddExerciseField type={"template"} workoutId={templateData.template_id} exercises={exercises} addedExercises={templateData.exercises}/>
          </div>
          
          
    </div>
  )
}

export default TemplateData
