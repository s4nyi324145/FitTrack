import { getLastWorkout } from "@/lib/queries/workouts";
import { Dumbbell, Clock, Layers, Weight } from "lucide-react";
import React from "react";

const LastWorkout = async ({ userId }: { userId: number }) => {
  const lastWorkout = await getLastWorkout(userId);

  return (
    <div className="bg-surface flex h-full flex-col gap-4 text-foreground border-2 border-border rounded-md p-6">
      <h1 className="font-bold">Last Workout</h1>

      {lastWorkout != "" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-text-muted/10 flex items-center justify-center">
            <Dumbbell size={22} className="text-text-muted" />
          </div>
          <p className="text-sm font-semibold text-text-muted">No workouts yet</p>
          <p className="text-xs text-text-subtle">Start your first workout to see it here</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">

          {/* Workout neve és dátuma */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-text-muted/10 flex items-center justify-center shrink-0">
                <Dumbbell size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{lastWorkout.name}</p>
                <p className="text-xs text-text-muted">{lastWorkout.notes ?? "—"}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md shrink-0">
              {getRelativeDate(lastWorkout.started_at)}
            </span>
          </div>

          <hr className="border-text-muted/10" />

          {/* Statisztikák */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-text-muted uppercase font-semibold">Volume</p>
              <p className="text-sm font-bold">{lastWorkout.total_volume_kg ?? 0} kg</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-text-muted uppercase font-semibold">Exercises</p>
              <p className="text-sm font-bold">{lastWorkout.total_sets ?? 0}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-text-muted uppercase font-semibold">Duration</p>
              <p className="text-sm font-bold">{formatDuration(lastWorkout.duration_seconds)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const getRelativeDate = (date: Date | string) => {
  const d = new Date(date);
  const today = new Date();
  const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
};

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

export default LastWorkout;