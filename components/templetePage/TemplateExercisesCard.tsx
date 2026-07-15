import { AddedExericsesTemplate } from '@/types'
import React from 'react'

type Props = {
    exercise: AddedExericsesTemplate
}

const muscleGroupColors: Record<string,{ bg: string; text: string; border: string } > = {
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


const TemplateExercisesCard = ({exercise}: Props) => {
      const muscle = muscleGroupColors[exercise.muscle_group] ?? { bg: "bg-surface-raised", text: "text-text-muted", border: "border-border" }
  return (
     <div className="flex flex-col rounded-xl border border-border overflow-hidden">
    
      <div
        className="bg-surface-raised flex flex-col p-4 flex-1 justify-center cursor-pointer hover:bg-border/30 transition-colors"
        
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
          <p className="font-bold text-foreground">{exercise.exercise_name}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${muscle.bg} ${muscle.text} ${muscle.border}`}>
            {exercise.muscle_group.charAt(0).toUpperCase() + exercise.muscle_group.slice(1)}
          </span>
        </div>
        
        </div>
      </div>
      

    
    
    </div>
  )
}

export default TemplateExercisesCard
