'use client'

import React, { useState, useRef, useEffect } from 'react'
import { EllipsisVertical, Dumbbell, Clock, ArrowRight, Trash2, TriangleAlert,Edit2 } from 'lucide-react';
import { TemplateWorkout } from '@/types';
import Link from 'next/link';
import { deleteTemplateById } from '@/app/actions/templateActions';

type Prop = {
  template: TemplateWorkout;
  muscleGroupColors: Record<string, { bg: string; text: string; border: string }>;

}

const TempleteWorkoutCard = ({ template, muscleGroupColors }: Prop) => {

 
    const [selectedTemplate, setSelectedTemplate] = useState<{template_id: null | number, name: string}>({template_id: null, name: ""})
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [isPending, setIsPending] = useState(false)


    const deleteTemplate =  async () => {

        setError(null)
        setIsPending(true)
        try {

            const result = await deleteTemplateById(selectedTemplate.template_id ?? 0)
            if(result?.error) setError(result.error)
            else {
                setShowConfirm(false)
            }

            //TODO: check with ai this actionss
            
            
        } catch (error) {
            setError("Server error")
        }
        finally{
            setIsPending(false)
        }


    }

  



  return (

    <>
         
    
    <div key={template.template_id} className="border relative bg-surface border-border rounded-md p-4 flex flex-col gap-1 transition-all">
        
        {showConfirm && (
        <div className="fixed inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-surface w-full max-w-[400px] flex rounded-md border-2 border-border gap-4 items-center flex-col p-4 justify-center">
            {error && <p className="text-red-500 font-bold text-sm bg-red-500/10 p-2 rounded">{error}</p>}
            <TriangleAlert className="text-red-500" />
            <p className="font-bold">Delete workout ?</p>
            <p className="text-center text-sm text-text-muted">
              This will permanently delete "{selectedTemplate?.name}" and all associated sets. This cannot be undone.
            </p>
            <div className="flex gap-3 w-full flex-1 mt-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="border-border cursor-pointer border rounded-md flex py-1.5 justify-center flex-[0.5] hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteTemplate} 
                disabled={isPending} 
                className="border-border cursor-pointer hover:bg-red-500 transition-colors bg-red-700 text-white border rounded-md flex py-1.5 justify-center flex-[0.5] disabled:opacity-50 font-semibold"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    
        
        {/* Fejléc */}
        <div className="flex flex-1 justify-between items-center">
            <p className="text-lg font-bold">{template.template_name}</p>
            
            <div className=" hover:bg-surface-raised rounded-full transition-colors cursor-pointer">
              <button 
                onClick={() => {setSelectedTemplate({template_id: template.template_id, name: template.template_name}); setShowConfirm(true)}}
              className={`flex items-center text-red-400 gap-2 px-3 py-2 text-sm rounded-full transition-colors cursor-pointer text-left w-full
                `}
            >
              <Trash2 size={20} /> 
              
            </button>
            </div>
        </div>

        <p className="text-text-muted italic text-sm line-clamp-1">{template.template_notes ?? "No Description"}</p>
        
        <div className="flex flex-col mt-4 gap-2">
            <ul className="flex flex-col gap-2 text-sm">
                {template.exercises.slice(0, 3).map((exercise) => (
                    <li key={exercise.exercise_id} className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <span className={`w-3 h-3 rounded-full ${muscleGroupColors[exercise.muscle_group]?.bg || 'bg-gray-500'}`}></span>
                            <p>{exercise.exercise_name}</p>
                        </div>
                    </li>
                ))}
                <li className="text-text-muted text-xs min-h-[16px]">
                  {template.exercises.length > 3 ? `+ ${template.exercises.length - 3} more exercises` : ''}
                </li>
            </ul>

            {/* Információs Sáv */}
            <div className="flex gap-3 bg-surface-raised/50 border border-border/50 items-center text-xs font-semibold p-2 rounded-md">
                <p className='flex items-center gap-2'> <Dumbbell size={15}/> {template.exercises.length} exercises</p>
                <p className="text-sm text-text-muted">|</p>
                <p className='flex items-center gap-2'><Clock size={15}/> {"-"} min</p>
            </div>

            {/* Akció Gombok */}
            <div className="flex flex-1 gap-2 mt-2">
                <button className="bg-primary flex cursor-pointer gap-2 flex-1 justify-center text-green-950 rounded-md p-2 text-sm font-semibold hover:bg-primary/80 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Start Workout <ArrowRight size={20}/>
                </button>
                <Link className="border bg-surface hover:bg-surface-raised border-border flex cursor-pointer justify-center flex-1 text-text-muted rounded-md p-2 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]" href={`/workouts/templates/${template.template_id}`}>
                  Edit Template
                </Link>
            </div>
        </div>
    </div>
    </>
  )
}

export default TempleteWorkoutCard