import type { RecentWorkout } from '@/types'
import { Dumbbell, Weight, LayoutList, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDuration, getRelativeDate } from '@/lib/utils/dataFormation'

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



const RecentWorkouts = ({ workouts }: { workouts: RecentWorkout[] }) => {
  if (workouts.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="font-bold text-xl">Recent History</p>
          <p className="text-sm text-text-muted">(Last 30 Days)</p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-surface border border-border rounded-xl">
          <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center">
            <Dumbbell size={22} className="text-text-muted" />
          </div>
          <p className="font-semibold text-foreground">No workouts yet</p>
          <p className="text-sm text-text-muted">Start your first workout to begin tracking</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="font-bold text-xl">Recent History</p>
        <p className="text-sm text-text-muted">(Last 30 Days)</p>
      </div>

      <div className="flex flex-col gap-3">
        {workouts.map((w, index) => {
          const muscle = muscleGroupColors[w.primary_muscle ?? ""] ?? { bg: "bg-primary/10", text: "text-primary" }

          return (
            <Link
              href={`/workouts/${w.id}`}
              key={index}
              className="bg-surface flex w-full flex-col border border-border rounded-xl p-4 hover:shadow-sm hover:-translate-y-0.5 transition-all gap-4"
            >
        
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-3 items-center min-w-0">
             
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${muscle.bg}`}>
                    <Dumbbell size={18} className={muscle.text} />
                  </div>

 
                  <div className="flex flex-col min-w-0">
                    <p className="font-semibold text-foreground truncate">{w.name}</p>
                    {w.notes && (
                      <p className="text-xs text-text-muted truncate">{w.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs bg-surface-raised text-text-muted px-2 py-1 rounded-full">
                    {getRelativeDate(w.started_at)}
                  </span>
                  <ArrowRight size={16} className="text-text-muted" />
                </div>
              </div>

          
              <div className="flex items-center gap-6 pt-2 border-t border-border">
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs uppercase text-text-muted font-semibold tracking-wide">Volume</p>
                  <p className="text-sm font-bold text-foreground">
                    {w.total_volume_kg ? `${w.total_volume_kg} kg` : "—"}
                  </p>
                </div>

                <div className="flex border-x-2 px-4 border-border flex-col gap-0.5">
                  <p className="text-xs uppercase text-text-muted font-semibold tracking-wide">Exercises</p>
                  <p className="text-sm font-bold text-foreground">
                    {w.total_exercises ?? "—"}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="text-xs uppercase text-text-muted font-semibold tracking-wide">Duration</p>
                  <p className="text-sm font-bold text-foreground">
                    {formatDuration(w.duration_seconds)}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default RecentWorkouts