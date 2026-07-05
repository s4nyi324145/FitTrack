'use client'

import { useState } from "react"
import { ChevronDown, ChevronUp, Weight } from "lucide-react";
import type { ExerciseCard } from "@/types";

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


const ExerciseCard = ({ ex }: { ex: ExerciseCard }) => {
  const [isOpen, setIsOpen] = useState(true)
  const muscle = muscleGroupColors[ex.muscle_group] ?? { bg: "bg-surface-raised", text: "text-text-muted", border: "border-border" }

  
  const bestSet = ex.sets.reduce((best: any, s: any) => {
    const vol = Number(s.weight) * (s.reps ?? 0)
    const bestVol = Number(best?.weight ?? 0) * (best?.reps ?? 0)
    return vol > bestVol ? s : best
  }, ex.sets[0])

  const totalVolume = ex.sets.reduce((acc: number, s: any) => acc + Number(s.weight) * (s.reps ?? 0), 0).toLocaleString()

  return (
    <div className="flex flex-col rounded-xl border border-border overflow-hidden">
    
      <div
        className="bg-surface-raised flex flex-col p-4 flex-1 justify-center cursor-pointer hover:bg-border/30 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
          <p className="font-bold text-foreground">{ex.name}</p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${muscle.bg} ${muscle.text} ${muscle.border}`}>
            {ex.muscle_group.charAt(0).toUpperCase() + ex.muscle_group.slice(1)}
          </span>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
        </div>
        {ex.notes && <p className="text-text-muted text-sm">{ex.notes}</p>}
      </div>
      

    
      {isOpen && (
        <>
          <div className="grid grid-cols-4 font-bold text-xs uppercase text-text-muted bg-surface border-y border-border px-4 py-2">
            <p>Set</p>
            <p>Weight</p>
            <p>Reps</p>
            <p className="text-right">Volume</p>
          </div>

          {ex.sets.map((set: any, index: number) => {
            const volume = Number(set.weight) * (set.reps ?? 0)
            const isPR = set.is_pr // TODO: PR logika

            return (
              <div
                key={index}
                className={`grid grid-cols-4 px-4 py-3 text-sm border-b border-border last:border-0 ${isPR ? "bg-amber-50" : index % 2 === 0 ? "bg-surface" : "bg-surface-raised/30"}`}
              >
                <p className="text-text-muted font-medium">
                  {set.type === "warmup" ? "W" : set.number}
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{parseInt(set.weight)} kg</p>
                  {isPR && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200">
                      🏆 PR
                    </span>
                  )}
                </div>
                <p className="font-semibold">{set.reps}</p>
                <p className="text-right text-text-muted">{volume.toLocaleString()} kg</p>
              </div>
            )
          })}

          {/* Footer */}
          <div className="flex justify-between px-4 py-2 bg-surface text-xs text-text-muted">
            <p>
              Best set: <span className="font-bold text-foreground">{parseInt(bestSet?.weight)}kg × {bestSet?.reps}</span>
            </p>
            <p>
              Volume: <span className="font-bold text-foreground">{totalVolume} kg</span>
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default ExerciseCard