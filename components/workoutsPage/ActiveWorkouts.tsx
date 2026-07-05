import { RecentWorkout } from '@/types'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, Dumbbell } from 'lucide-react'

type Props = {
    workouts: RecentWorkout[]
}

const muscleGroupColors: Record<string, { bg: string; text: string }> = {
  chest:     { bg: "bg-blue-500/30",   text: "text-blue-500"   },
  back:      { bg: "bg-purple-500/30", text: "text-purple-500" },
  shoulders: { bg: "bg-yellow-500/30", text: "text-yellow-500" },
  biceps:    { bg: "bg-green-500/30",  text: "text-green-500"  },
  triceps:   { bg: "bg-orange-500/30", text: "text-orange-500" },
  legs:      { bg: "bg-red-500/30",    text: "text-red-500"    },
  glutes:    { bg: "bg-pink-500/30",   text: "text-pink-500"   },
  core:      { bg: "bg-cyan-500/30",   text: "text-cyan-500"   },
  cardio:    { bg: "bg-rose-500/30",   text: "text-rose-500"   },
}

const ActiveWorkouts = ({workouts}: Props) => {
  return (
     <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="font-bold text-xl">Active Workout</p>
      </div>

      <div className="flex flex-col gap-3">
        {workouts.map((w, index) => {
          const muscle = muscleGroupColors[w.primary_muscle ?? ""] ?? { bg: "bg-primary/30", text: "text-primary" }
          console.log(muscle.bg.split("-")[1]);
          
          return (
            <Link
              href={`/workouts/${w.id}/active`}
              key={index}
              className={`bg-surface flex w-full flex-col border border-border rounded-xl p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all gap-4`}
            >
              {/* Felső sor */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-3 items-center min-w-0">
                  {/* Ikon */}
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${muscle.bg}`}>
                    <Dumbbell size={18} className={muscle.text} />
                  </div>

                  {/* Név + notes */}
                  <div className="flex flex-col min-w-0">
                    <p className="font-semibold text-foreground truncate">{w.name}</p>
                    {w.notes && (
                      <p className="text-xs text-text-muted truncate">{w.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className='flex gap-2 text-xs bg-primary-hover/50 text-white px-2 py-1 rounded-full items-center'>
                        <span className="">
                            Active
                        </span>
                        <span className='w-2 h-2 rounded-full animate-pulse bg-red-500'>

                        </span>
                  </span>
                  <ArrowRight size={16} className="text-text-muted" />
                </div>
              </div>

            </Link>
          )
        })}
      </div>
    </div>
  
  )
}

export default ActiveWorkouts
