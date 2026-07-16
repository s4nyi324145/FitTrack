
"use client"

import React from 'react'
import { TemplateWorkout } from '@/types'
import { EllipsisVertical, MailPlus, Dumbbell, Clock, ArrowRight, RotateCcw,  } from 'lucide-react';
import Link from 'next/link'
import TempleteWorkoutCard from './TempleteWorkoutCard';
import { useState } from 'react';
import { useToast } from '@/app/context/toastContext';
import { createNewTemplate } from '@/app/actions/templateActions';
import { useRouter } from 'next/navigation';

type Prop = {
  workoutTemplates: TemplateWorkout[]
}

const muscleGroupColors: Record<string,{ bg: string; text: string; border: string }> = {
  chest: { bg: "bg-blue-500", text: "text-white", border: "border-blue-600" },
  back: {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-600",
  },
  shoulders: {
    bg: "bg-yellow-500",
    text: "text-white",
    border: "border-yellow-600",
  },
  biceps: {
    bg: "bg-green-500",
    text: "text-white",
    border: "border-green-600",
  },
  triceps: {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-600",
  },
  legs: { bg: "bg-red-500", text: "text-white", border: "border-red-600" },
  glutes: { bg: "bg-pink-500", text: "text-white", border: "border-pink-600" },
  core: { bg: "bg-cyan-500", text: "text-white", border: "border-cyan-600" },
  cardio: { bg: "bg-rose-500", text: "text-white", border: "border-rose-600" },
  full_body: {
    bg: "bg-teal-500",
    text: "text-white",
    border: "border-teal-600",
  },
};


const TemplateWorkouts = ({workoutTemplates}: Prop) => {


    const [loading, setLoading] = useState(false)
    const {showError, showSuccess} = useToast()
    const router = useRouter()
  
    const handleNewTemplate = async () => {
  
      setLoading(true)
  
      try {
        const result = await createNewTemplate()
        if(result?.error){
            return showError(result.error)
        }
        showSuccess("Template created successfully")
        router.push(`/workouts/templates/${result.id}`)
      }
      catch (error) {
        showError("Server error")
      } 
      finally {
        setLoading(false)
      }
     
  
      }


  return (
    <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1rem', height: '100%'}}>
       {workoutTemplates.map((template) => (
        <TempleteWorkoutCard key={template.template_id} template={template} muscleGroupColors={muscleGroupColors} />
       ))}
       
     
        <div onClick={() => handleNewTemplate()}  className=" border-3 border-dashed border-border rounded-md flex gap-4 flex-col p-10 items-center justify-center cursor-pointer hover:bg-surface/50 transition-colors">
            <div className="w-15 h-15 rounded-full bg-primary/20 flex items-center justify-center">
               {loading ? <RotateCcw size={25} className='animate-spin'/>  :  <MailPlus size={25} className="text-primary" />}
            </div>
           <div className="flex flex-col items-center gap-1">
                <p  className="text-sm font-semibold">{loading ? "Creating..." : "Create New Template"}</p>
                <p className="text-text-muted text-xs">Start from scratch and build your own workout template.</p>
           </div>
       
        </div>  
       
    </div>
  )
}

export default TemplateWorkouts
