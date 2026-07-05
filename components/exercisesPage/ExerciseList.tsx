"use client";

import React, { useEffect, useState } from "react";
import FilterFields from "./FilterFields";
import type { Exercise, FilterExercise, CreateExerciseInput, PersonalRecord } from "@/types";
import ExerciseCard from "./ExerciseCard";
import { Dumbbell } from "lucide-react";
import CreateExerciseModal from "./CreateExerciseModal";
import ExerciseDetailModal from "./ExerciseDetailModal";
import { uploadExercise } from "@/app/actions/exercisesAction";
import { getPrsByExId } from "@/lib/queries/personalRecords";
import { useToast } from "@/app/context/toastContext";

const ExerciseList = ({ exercises }: { exercises: Exercise[] }) => {

  const [filter, setFilter] = useState<FilterExercise>({
    name: "",
    muscle: "All",
    equipment: "All",
    sorted: "popular",
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filteredEx, setFilteredEx] = useState<Exercise[]>(exercises);
  const [newExercise, setNewExercise] = useState<CreateExerciseInput>({
    name: "",
    muscle_group: "Chest",
    equipment: "Barbell",
    exercise_type: "Strength",
    instructions: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [prs,setPrs] = useState<PersonalRecord[]>([])

  useEffect(() => {
    setFilteredEx(exercises);
  },[exercises])


  const getPrsForExercise = async () => {
    try {
      if(!selectedExercise) return
      const result = await getPrsByExId(selectedExercise?.id)
      if(result.error ) return
      if(result.success) setPrs(result.prs)
      
    } catch (error) {
       console.log(error);
       
    }
  }

  useEffect(() => {
    setFilteredEx(
      exercises.filter((exercise) => {
        if (filter.muscle == "All" && filter.equipment == "All") {
          return exercise.name
            .toLowerCase()
            .includes(filter.name.toLowerCase());
        }
        if (filter.muscle != "All" && filter.equipment == "All") {
          return (
            exercise.muscle_group.toLowerCase() == filter.muscle.toLowerCase()
          );
        }
        if (filter.muscle == "All" && filter.equipment != "All") {
          return (
            exercise.equipment.toLowerCase() == filter.equipment.toLowerCase()
          );
        }
        if (filter.muscle != "All" && filter.equipment != "All") {
          return (
            exercise.muscle_group.toLowerCase() ==
              filter.muscle.toLowerCase() &&
            exercise.equipment.toLowerCase() == filter.equipment.toLowerCase()
          );
        }
      }),
    );

    //console.log(filter)
  }, [filter]);

  useEffect(() => {getPrsForExercise()}, [selectedExercise])

  const update = (fields: Partial<Exercise>) => {
    setNewExercise((prev) => ({ ...prev, ...fields }));
  };

  const {showError} = useToast()

  const handleNewExercise = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await uploadExercise(newExercise);
      if (result.error) {
        setError(result.error);
        showError(result.error)
        setIsLoading(false);
      } else {
        setShowModal(false);
        setNewExercise({
          name: "",
          muscle_group: "Chest",
          equipment: "Barbell",
          exercise_type: "Strength",
          instructions: "",
        });
      }
    } catch (error) {
      setError("Something went wrong on the server");
      setIsLoading(false);
    }
  };

  return (
    <>
      {showModal && 
          <CreateExerciseModal
            handleNewExercise={handleNewExercise}
            newExercise={newExercise}
            update={update}
            error={error}
            loading={isLoading}
            setShowModal={setShowModal}
          />
      }

      <div className="flex flex-1 flex-col gap-5 p-8">
        <div className="flex mb-7 flex-col gap-3">
          <p className=" text-3xl  font-bold">Exercise Library</p>
          <p className="text-text-muted">
            Browse, search, and discover over 500+ exercises to build your
            perfect routine.
          </p>
        </div>

        <FilterFields filter={filter} setFilter={setFilter} />

        <div className="flex  mt-5  w-full items-center justify-between">
          <div className="flex gap-4">
            <p className="text-sm">Showing {filteredEx.length} exercises</p>
            <div className="flex text-sm gap-0.2">
              <p className="text-sm">Sort By:</p>
              <select name="sortby" id="sortby">
                <option value="popluar">Popular</option>
              </select>
            </div>
          </div>
          <div
            onClick={() => setShowModal(true)}
            className="text-primary border rounded-md cursor-pointer bg-primary/20 border-primary p-2"
          >
            <p>Add custom exercise</p>
          </div>
        </div>

        {filteredEx.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center">
              <Dumbbell size={24} className="text-text-muted" />
            </div>
            <p className="font-semibold text-foreground">No exercises found</p>
            <p className="text-sm text-text-muted text-center">
              Try adjusting your filters or search term
            </p>
            <button
              onClick={() =>
                setFilter({
                  name: "",
                  muscle: "All",
                  equipment: "All",
                  sorted: "popular",
                })
              }
              className="text-sm text-primary font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {filteredEx.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} onSelect={(ex) => setSelectedExercise(ex)} />
            ))}

            {selectedExercise && <ExerciseDetailModal prs={prs} exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
          </div>
        )}
      </div>
    </>
  );
};

export default ExerciseList;
