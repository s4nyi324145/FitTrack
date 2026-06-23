

import { getWorkoutsData } from "@/lib/queries/workouts";
import React from "react";
import { Calendar, Zap, Dumbbell, Clock } from "lucide-react";
import type { WorkoutStats } from "@/types";

const stats = (stat: WorkoutStats) => [
  {
    icon: <Calendar size={20} className="text-blue-500" />,
    iconBg: "bg-blue-500/10",
    value: stat.total_workouts,
    label: "Total Workouts",
  },
  {
    icon: <Zap size={20} className="text-primary" />,
    iconBg: "bg-primary/10",
    value: stat.this_week_workouts,
    label: "This Week",
  },
  {
    icon: <Dumbbell size={20} className="text-purple-500" />,
    iconBg: "bg-purple-500/10",
    value: `${(stat.total_volume)} kg`,
    label: "Total Volume",
  },
  {
    icon: <Clock size={20} className="text-orange-500" />,
    iconBg: "bg-orange-500/10",
    value: `${(stat.avg_duration / 60).toFixed(0)} min`,
    label: "Avg Duration",
  },
];

const WorkoutStats = async () => {
  const stat = await getWorkoutsData();

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
    >
      {stats(stat).map((s) => (
        <div
          key={s.label}
          className="flex flex-col justify-between gap-6 bg-surface border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.iconBg}`}>
            {s.icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="uppercase text-text-muted text-xs font-semibold tracking-wide">
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutStats;