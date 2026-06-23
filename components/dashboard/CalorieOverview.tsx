import { getDailyNutrition } from "@/lib/queries/nutrition";
import React from "react";

const CalorieOverview = async ({ userId }: { userId: number }) => {
  const summary = await getDailyNutrition(userId);
  const progress = Math.min(
    (Number(summary.total_calories) / Number(summary.daily_calorie_goal)) * 100,
    100
  );

  return (
    <div className="bg-surface text-foreground flex h-full flex-col gap-4  border-2 border-border rounded-md p-6">
      <h1 className="font-bold">Today's Nutrition</h1>
      <div className="flex gap-6 items-center">
        
        {/* Kördiagram */}
        <div
          className="relative shrink-0 w-36 h-36 rounded-full"
          style={{
            background: `conic-gradient(#22c55e ${progress}%, #e5e7eb ${progress}%)`,
          }}
        >
          <div className="absolute inset-2 bg-surface-raised text-foreground rounded-full flex flex-col items-center justify-center gap-1">
            <p className="text-xl font-bold">{Math.round(Number(summary.total_calories))}</p>
            <p className="text-xs text-gray-400">/ {summary.daily_calorie_goal} kcal</p>
          </div>
        </div>

        {/* Makrók */}
        <div className="flex flex-1  gap-3">
          <div className="flex p-4 flex-1 items-center flex-col bg-blue-100 border border-blue-200 rounded-md">
            <p className="uppercase text-xs text-blue-600 font-semibold">Protein</p>
            <p className="text-blue-700 font-bold text-lg">{Math.round(Number(summary.total_protein))}g</p>
          </div>
          <div className="flex p-4 flex-col items-center flex-1 bg-orange-100 border border-orange-200 rounded-md">
            <p className="uppercase text-xs text-orange-600 font-semibold">Carbs</p>
            <p className="text-orange-700 font-bold text-lg">{Math.round(Number(summary.total_carbs))}g</p>
          </div>
          <div className="flex p-4 flex-col flex-1 items-center bg-red-100 border border-red-200 rounded-md">
            <p className="uppercase text-xs text-red-600 font-semibold">Fat</p>
            <p className="text-red-700 font-bold text-lg">{Math.round(Number(summary.total_fat))}g</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieOverview;