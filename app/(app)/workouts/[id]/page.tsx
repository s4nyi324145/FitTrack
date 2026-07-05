
import React from 'react'
import { MoveLeft, Trash2, Dumbbell, Layers, Clock, Weight } from 'lucide-react';
import Link from 'next/link';
import { getWorkoutDetail } from '@/lib/queries/workouts';
import ExercisesBreakdown from '@/components/workoutDetails/ExercisesBreakdown';
import DeleteWorkoutButton from '@/components/workoutDetails/DeleteWorkoutButton';
import EditWorkoutButton from '@/components/workoutDetails/EditWorkoutButton';
import { WorkoutDetail } from '@/types';


type WorkoutsDetailPageProps = {
  params: Promise<{ id: string }>;
}

export default async function WorkoutDetailPage({ params }: WorkoutsDetailPageProps) {
  const { id } = await params;
  const workoutDetail = await getWorkoutDetail(parseInt(id))

  if (!workoutDetail || Array.isArray(workoutDetail)) {
    return (
      <div className="flex  flex-1 min-h-screen flex-col items-center justify-center h-full gap-4 p-8">
        <Dumbbell size={40} className="text-text-muted" />
        <p className="font-semibold text-foreground">Workout not found</p>
        <Link href="/workouts" className="text-primary text-sm font-semibold hover:underline">
          ← Back to Workouts
        </Link>
      </div>
    );
  }

  const duration = workoutDetail.duration / 60

  

  const stats = [
    { icon: <Weight size={18} className="text-purple-500" />,  iconBg: "bg-purple-500/10", label: "Total Volume",  value: workoutDetail.volume ? `${parseInt(workoutDetail.volume).toLocaleString()} kg` : "—" },
    { icon: <Dumbbell size={18} className="text-blue-500" />,  iconBg: "bg-blue-500/10",   label: "Exercises",    value: workoutDetail.exercises.length },
    { icon: <Layers size={18} className="text-primary" />,     iconBg: "bg-primary/10",    label: "Total Sets",   value: workoutDetail.total_sets ? workoutDetail.total_sets : "—" },
    { icon: <Clock size={18} className="text-orange-500" />,   iconBg: "bg-orange-500/10", label: "Duration",     value: duration ? `${duration.toFixed(0)} min` : "—" },
  ]

  return (
    <div className="flex flex-col animate-toast-in flex-1 p-8 gap-6">
      
      
      <div className="flex items-start justify-between">
        <div className="flex gap-1 flex-col">
          <Link href="/workouts" className="flex hover:text-primary text-text-muted text-sm items-center gap-2 w-fit">
            <MoveLeft size={14} />
            <p>Workouts</p>
          </Link>
          <p className="font-bold text-2xl mt-1">{workoutDetail.name}</p>
          <p className="text-text-muted flex gap-2   text-sm">
            {new Date(workoutDetail.started_at).toLocaleDateString("en-EN", {
              weekday: "long", month: "long", day: "numeric", year: "numeric"
            })}
            {duration && <span className='flex items-center gap-2'> · <Clock size={14}/> {duration.toFixed(0)} min</span>}
          </p>
        </div>

       <div className='flex gap-2'>
             <DeleteWorkoutButton name={workoutDetail.name} id={id}/>
             <EditWorkoutButton id={parseInt(id)} currentName={workoutDetail.name} currentNotes={workoutDetail.notes}/>
       </div>
      </div>

    
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col justify-between gap-4 bg-surface border border-border rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.iconBg}`}>
              {s.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-xl font-bold min-w-0 truncate text-foreground">{s.value}</p>
              <p className="uppercase text-text-muted text-xs font-semibold tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>


      {workoutDetail.notes && (
        <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-1">
          <p className="uppercase text-xs font-bold text-text-muted tracking-wider">Notes</p>
          <p className="text-sm text-foreground">{workoutDetail.notes}</p>
        </div>
      )}

      <ExercisesBreakdown workoutDetail={workoutDetail} />
    </div>
  );
}