'use client'

import { deleteExerciseFromTemplate } from "@/app/actions/templateActions";
import { useToast } from "@/app/context/toastContext";
import { AddedExericsesTemplate, TemplateWorkout } from "@/types";
import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical,TriangleAlert, Trash2 } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";

type Props = {
  exercise: AddedExericsesTemplate;
  index: number;
  templete_id:number
  templateDataS: TemplateWorkout
  setTemplateDataS: Dispatch<SetStateAction<TemplateWorkout>>
};

const muscleGroupColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
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

const TemplateExercisesCard = ({ exercise, index,templete_id, templateDataS, setTemplateDataS }: Props) => {
  const muscle = muscleGroupColors[exercise.muscle_group] ?? {
    bg: "bg-surface-raised",
    text: "text-text-muted",
    border: "border-border",
  };

  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [isPending, setIsPending] = useState(false)
  const {showSuccess,showError} = useToast()

   const handleDeleteExercise = async () => {
     setError(null);
     setIsPending(true)

     //Optimistic update
     const previousEx = [...templateDataS.exercises]
     const updatedEx = templateDataS.exercises.filter(ex => ex.template_exercise_id !== exercise.template_exercise_id)
     setTemplateDataS(prev => ({...prev, exercises: updatedEx}))
     try {
        const result = await deleteExerciseFromTemplate(templete_id, exercise.template_exercise_id)
        console.log(result);
        if(result.error) {
          showError(result.error)
          setTemplateDataS(prev => ({...prev, exercises: previousEx}))
        }
        if(result.success) {
          setShowConfirm(false)
          return showSuccess("Exercise removed succesfully")

        } 

      

     } catch (error) {
       showError("Server error")
       setTemplateDataS(prev => ({...prev, exercises: previousEx}))
     }
     finally{
      setIsPending(false)
     }
   };

  const { ref, handleRef, isDragSource } = useSortable({
    id: String(exercise.template_exercise_id),
    index: index,
  });

  return (

  <>
      {showConfirm && (
        <div  className="fixed inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-surface w-full max-w-[400px] flex rounded-md border-2 border-border gap-4 items-center flex-col p-4 justify-center">
            {error && (
              <p className="text-red-500 font-bold text-sm bg-red-500/10 p-2 rounded">
                {error}
              </p>
            )}
            <TriangleAlert className="text-red-500" />
            <p className="font-bold">Delete Exercise ?</p>
            <p className="text-center text-sm text-text-muted">
              This will permanently delete "{exercise.exercise_name}" and all associated sets.
              This cannot be undone.
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
                onClick={handleDeleteExercise}
                disabled={isPending}
                className="border-border cursor-pointer hover:bg-red-500 transition-colors bg-red-700 text-white border rounded-md flex py-1.5 justify-center flex-[0.5] disabled:opacity-50 font-semibold"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    <div
        ref={ref}
        style={{ opacity: isDragSource ? 0.5 : 1 }}
        className="flex flex-col rounded-xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="bg-surface-raised flex p-4 items-center justify-between hover:bg-border/30 transition-colors">
          <div className="flex gap-3 items-center">
            <GripVertical
              ref={handleRef}
              className="cursor-grab hover:text-primary transition-colors shrink-0"
              size={18}
            />
            <p className="font-bold text-foreground">{exercise.exercise_name}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${muscle.bg} ${muscle.text} ${muscle.border}`}>
              {exercise.muscle_group.charAt(0).toUpperCase() + exercise.muscle_group.slice(1)}
            </span>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="text-text-muted cursor-pointer hover:text-red-500 transition-colors shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Default sets tábla */}
        <div className="bg-surface">
          {/* Fejléc */}
          <div className="grid grid-cols-3 gap-2 px-4 py-2 border-y border-border">
            <p className="text-xs font-bold uppercase text-text-muted">Sets</p>
            <p className="text-xs font-bold uppercase text-text-muted">Default Weight</p>
            <p className="text-xs font-bold uppercase text-text-muted">Default Reps</p>
          </div>

          {/* Értékek */}
          <div className="grid grid-cols-3 gap-2 px-4 py-3">
            <input
              type="number"
              defaultValue={exercise.default_sets ?? 3}
              placeholder="3"
              className="w-full text-center text-sm font-semibold border border-border rounded-md py-1.5 bg-surface-raised focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
            <input
              type="number"
              defaultValue={exercise.default_weight_kg ?? ""}
              placeholder="kg"
              className="w-full text-center text-sm font-semibold border border-border rounded-md py-1.5 bg-surface-raised focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
            <input
              type="number"
              defaultValue={exercise.default_reps ?? 10}
              placeholder="reps"
              className="w-full text-center text-sm font-semibold border border-border rounded-md py-1.5 bg-surface-raised focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            />
          </div>

          {/* Tipp */}
          <p className="text-xs text-text-muted italic px-4 pb-3">
            These values pre-fill when you start a workout from this template
          </p>
        </div>
      </div>
  
  </>
  );
};

export default TemplateExercisesCard;
