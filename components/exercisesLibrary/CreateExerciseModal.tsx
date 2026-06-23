import React from "react";
import InputField from "../shared/InputField";
import type { CreateExerciseInput } from "@/types";

type Props = {
  newExercise: CreateExerciseInput;
  handleNewExercise: () => void
  error:  string | null,
  loading: boolean
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  update: (fields: Partial<CreateExerciseInput>) => void;
};

const CreateExerciseModal = ({ setShowModal, update, error,loading,handleNewExercise,newExercise }: Props) => {
  const muscleGrops = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Legs",
    "Glutes",
    "Core",
    "Cardio",
  ];
  const equipments = [
    "Barbell",
    "Dumbell",
    "Machine",
    "BodyWeight",
    "Cable",
    "Resistance Band",
    "Kettlebell",
  ];

  const exercise_type = ["Strength", "Cardio", "Stretching"]

  // TODO Adding tips field with the calude design


  return (
    <div className="flex flex-col border-2 border-border bg-surface max-w-[600px] w-full max-h-[90vh] overflow-y-auto rounded-xl">
      <div className="flex flex-1 items-center p-6 justify-between">
        <p className="text-2xl font-bold">Add custom exercise</p>
        <p className="hover:text-red-400 font-bold cursor-pointer" onClick={() => setShowModal((prev) => !prev)}>X</p>
      </div>

      

      <div className="border-y-2 p-6 flex flex-col gap-6 border-border">

        {error && <p className="text-red-500 font-bold text-sm bg-red-500/10 p-2 rounded">{error}</p>}

        <InputField
          label={"EXERCISE NAME"}
          value={newExercise.name}
          onChange={(e) => update({ name: e.target.value })}
          type="text"
          placeholder="e.g Bench Press"
        />

        <div className="flex gap-1.5 flex-col">
          <p className="text-sm font-semibold text-text-muted">MUSCLE GROUP</p>
          <div className="flex gap-2 flex-wrap">
            {muscleGrops.map((muscle, index) => (
              <div
                key={index}
                onClick={() => update({ muscle_group: muscle })}
                className={`px-3 transition-colors  py-1 cursor-pointer  border-border border   ${newExercise.muscle_group.toLowerCase() == muscle.toLowerCase() ? "bg-primary text-white" : "bg-surface "} text-md rounded-full`}
              >
                {muscle}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-1.5 flex-col">
          <p className="text-sm font-semibold text-text-muted">EQUIPMENT</p>
          <select
            name="equipment"
            id="equipment"
            value={newExercise.equipment}
            onChange={(e) => update({ equipment: e.target.value })}
            className="h-11  w-full rounded-btn border border-border bg-surface-raised px-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
          >
            {equipments.map((eq, index) => (
              <option key={index} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-muted">
            EXERCISE TYPE
          </label>
          <div className="flex bg-text-muted/20 p-1 rounded-md gap-1">
            {exercise_type.map((t,index) => 
            <div key={index} onClick={() => update({exercise_type: t})} className={`flex flex-1 justify-center cursor-pointer transition-colors ${newExercise.exercise_type == t ? "bg-surface text-primary" : ""}  rounded-md px-4 py-2 text-sm font-semibold  `}>
              {t}
            </div>  
          )}
            
          </div>
        </div>

        <div className="flex gap-1.5 flex-col">
          <p className="text-sm font-semibold text-text-muted">INSTRUCTIONS</p>
          <textarea
          value={newExercise.instructions}
          onChange={(e) => update({instructions: e.target.value})}
            placeholder="Describe how to perform the exercise..."
            className="h-22 p-2   w-full rounded-btn border border-border bg-surface-raised px-3 text-sm text-foreground outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
          ></textarea>
        </div>
      </div>

      

      <div className="flex justify-center  gap-6 p-6">
        <button
          onClick={() => setShowModal((prev) => !prev)}
          className="flex flex-1 justify-center cursor-pointer hover:bg-surface-raised transition-all rounded-md p-2 bg-surface border border-border"
        >
          Cancel
        </button>
        <button onClick={() => handleNewExercise()} className="flex flex-1 justify-center rounded-md p-2 cursor-pointer hover:bg-primary-hover transition-colors bg-primary border text-white border-border">
          Save Exercise
        </button>
      </div>
    </div>
  );
};

export default CreateExerciseModal;
