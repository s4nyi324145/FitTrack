import React, { Dispatch, SetStateAction, useEffect } from "react";
import { X, Search } from "lucide-react";
import type { AddedExericses, AddedExericsesTemplate, Exercise, FilterExercise, WorkoutDetail } from "@/types";
import { useState } from "react";
import InlineExerciseCard from "./InlineExerciseCard";
const AddExerciseModal = ({exercises, workoutId, setShowExercises, addedExercises, type}: {exercises: Exercise[], workoutId: number, setShowExercises: React.Dispatch<SetStateAction<boolean>>, addedExercises: AddedExericses[] | AddedExericsesTemplate[], type:string}) => {

    const [filter, setFilter] = useState<FilterExercise>({
        name: "",
        muscle: "All",
        equipment: "All",
        sorted: "popular",
      });

    const [filteredEx, setFilteredEx] = useState(exercises)


    useEffect(() => {

      
      
        let filtered = exercises
        if (filter.muscle) filtered = exercises.filter(ex => filter.muscle != 'All' ? ex.muscle_group.toLowerCase() == filter.muscle.toLowerCase() : exercises)
        if (filter.name) filtered = exercises.filter(ex => ex.name.toLowerCase().includes(filter.name.toLowerCase()))
        
        setFilteredEx(filtered)

    }, [filter])

        const muscleGrops = ["All", "Chest", "Back","Shoulders","Biceps","Triceps" ,"Legs", "Glutes", "Core", "Cardio"]

  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="flex flex-col bg-surface max-w-[680px]  w-full max-h-[90vh]  overflow-y-auto rounded-xl shadow-xl">
        <div className="flex flex-1 justify-between p-6">
          <p className="font-bold">Add Exercise</p>
          <X className="cursor-pointer hover:text-red-500 transition-all" onClick={() => setShowExercises(false)} />
        </div>
        <hr className="border-border border flex flex-1" />
        <div className="flex flex-col gap-4 bg-surface-raised p-6">
          <div className="flex items-center p-3  gap-2 rounded-md border border-border bg-border/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <Search size={18} className="text-text-subtle shrink-0" />

            <input
              type="text"
              value={filter.name}
              onChange={(e) => setFilter(prev => ({...prev, name:e.target.value}))}
              placeholder="Search exercises..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-subtle"
            />
          </div>

          <div className='flex  flex-1 gap-2 flex-wrap'>
            {muscleGrops.map((muscle, index) =>  
                <div key={index} onClick={() => setFilter(prev => ({...prev, muscle: muscle})) } className={`px-3 transition-colors  py-1 cursor-pointer ${filter.muscle == muscle ? "bg-primary-hover text-white" : "bg-border/50 hover:bg-border" }   text-md rounded-full`}>
                  {muscle}
                </div>

            )}
         </div>

        </div>
        <hr className="border-border border flex flex-1" />
        <div className="flex flex-col p-6">
        
        <div className="flex flex-col max-h-[500px] overflow-y-auto gap-2">
            {filteredEx.map((ex,index) => 
                <InlineExerciseCard key={index} addedExercises={addedExercises} type={type} workout_id={workoutId} ex={ex}/>
        )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default AddExerciseModal;
