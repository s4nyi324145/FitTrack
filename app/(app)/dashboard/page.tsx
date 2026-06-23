import CalorieOverview from "@/components/dashboard/CalorieOverview";
import { auth } from "@/lib/auth";
import React from "react";
import { redirect } from "next/navigation";
import LastWorkout from "@/components/dashboard/LastWorkout";

const Dashboard = async () => {
  const session = await auth();

  const date = new Date();

  return (
    <div className="flex flex-1 flex-col p-8">
      <p className="text-sm">
        {date.toLocaleDateString("en-EN", {
          month: "long",
          day: "numeric",
          weekday: "long",
          year: "numeric",
        })}
      </p>
      <div className="flex mb-7 justify-between items-center">
        <p className=" text-3xl font-bold">Overview</p>
        <div className="flex items-center gap-2">
          <button className="bg-background border-2 border-border p-1.5 rounded-md">
            Log Meal
          </button>
          <button className="bg-primary border-2 border-border p-1.5 rounded-md">
            Start Workout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CalorieOverview userId={Number(session?.user?.id)} />
        </div>
        <div className="lg:col-span-1">
          <LastWorkout userId={Number(session?.user?.id)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
