'use client'

import React, { useState } from 'react'
import { EllipsisVertical, MailPlus, Dumbbell, Clock, ArrowRight } from 'lucide-react';
import { TemplateWorkout } from '@/types';
type Prop = {
  template: TemplateWorkout;
  muscleGroupColors: Record<string,{ bg: string; text: string; border: string }>;
}

const TempleteWorkoutCard = ({template, muscleGroupColors}: Prop) => {


 const [showToolTip, setShowToolTip] = useState(false)


  return (

        <div key={template.template_id} className="border bg-surface border-border rounded-md p-4 flex flex-col gap-1">
            <div className="flex flex-1 justify-between relative  bg-red-600 items-center">
                <p className="text-lg font-bold">{template.template_name}</p>
                <EllipsisVertical className="text-text-muted  cursor-pointer" size={20} onClick={() => setShowToolTip(!showToolTip)} />
                {showToolTip && 
                    <div className='absolute left-0 bg-surface-raised z-10'>
                        <p>sdsds</p>
                    
                    </div>}
            </div>
            <p className="text-text-muted italic text-sm">{template.template_notes ?? "No Description"}</p>
            <div className="flex flex-col mt-4 gap-2">
                <ul className="flex flex-col gap-2 text-sm">
                    {template.exercises.slice(0,3).map((exercise) => (
                        <li key={exercise.exercise_id} className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <span className={`w-3 h-3 rounded-full ${muscleGroupColors[exercise.muscle_group]?.bg || 'bg-gray-500'}`}></span>
                                <p>{exercise.exercise_name}</p>
                            </div>
                           
                        </li>
                    ))}
                    <li className="text-text-muted text-xs">{template.exercises.length > 3 ? `+ ${template.exercises.length - 3} more exercises` : ''}</li>
                </ul>

                <div className="flex gap-3 bg-border items-center text-xs font-semibold p-2  rounded-md">
                    <p className='flex items-center gap-2'> <Dumbbell size={15}/> {template.exercises.length} exercises</p>
                    <p className="text-sm text-text-muted">|</p>
                    <p className='flex items-center gap-2'><Clock size={15}/> {"-"} min</p>
                </div>

                <div className="flex flex-1 gap-2 mt-2">
                    <button className="bg-primary flex cursor-pointer gap-2 flex-1 justify-center text-green-900  rounded-md p-2 text-sm font-semibold hover:bg-primary/80   transition-colors">Start Workout <ArrowRight size={20}/></button>
                    <button className="border bg-surface hover:bg-surface-raised border-border flex cursor-pointer justify-center flex-1 text-text-muted rounded-md p-2 text-sm font-semibold  transition-colors">Edit Template</button>
                </div>
            </div>
        </div>
     
  )
}

export default TempleteWorkoutCard
