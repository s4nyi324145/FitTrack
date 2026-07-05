"use client";

import { useState, useTransition } from "react";
import {
  Check,
  ChevronDown,
  TriangleAlert,
  ChevronUp,
  Trash2,
  Plus,
  X,
  Minus,
  GripVertical,
} from "lucide-react";
import {
  deleteExerciseFromWorkout,
  saveExerciseNote,
  saveSetToExercise,
  deleteSet,
} from "@/app/actions/workoutsActions";

import { useDraggable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";

const muscleGroupColors: Record< 
string,
  { bg: string; text: string; border: string }
> = {
  chest: { bg: "bg-blue-500", text: "text-white", border: "border-blue-600" },
  back: { bg: "bg-purple-500", text: "text-white", border: "border-purple-600" },
  shoulders: { bg: "bg-yellow-500", text: "text-white", border: "border-yellow-600" },
  biceps: { bg: "bg-green-500", text: "text-white", border: "border-green-600" },
  triceps: { bg: "bg-orange-500", text: "text-white", border: "border-orange-600" },
  legs: { bg: "bg-red-500", text: "text-white", border: "border-red-600" },
  glutes: { bg: "bg-pink-500", text: "text-white", border: "border-pink-600" },
  core: { bg: "bg-cyan-500", text: "text-white", border: "border-cyan-600" },
  cardio: { bg: "bg-rose-500", text: "text-white", border: "border-rose-600" },
  full_body: { bg: "bg-teal-500", text: "text-white", border: "border-teal-600" },
};

type Sets = {
  id: number;
  tempId?: string;
  number: number;
  type: string;
  weight: number;
  reps: number | null;
  previous?: string;
  completed: boolean;
};

type Props = {
  ex: any;
  workout_id: number
}

const ActiveExerciseCard = ({ex,workout_id}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sets, setSets] = useState<Sets[]>(ex.sets);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [noteInput, setNoteInput] = useState(ex.notes ?? "");
  const muscle = muscleGroupColors[ex.muscle_group] ?? {
    bg: "bg-surface-raised",
    text: "text-text-muted",
    border: "border-border",
  };

  const {ref,handleRef,isDragSource} = useSortable({id: ex.id, index: ex.order })

  const updateSet = (index: number, fields: Partial<Sets>) => {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...fields } : s)),
    );
  };

  const handleNewSet = () => {
    setSets((prev) => [
      ...prev,
      {
        id: 0,
        tempId: crypto.randomUUID(),
        number: prev.length + 1,
        type: "normal",
        weight: 0,
        reps: null,
        completed: false,
      },
    ]);
  };

  const handleRemoveLastSet = async () => {
    if (sets.length === 0) return;
    const lastSet = sets[sets.length - 1];

    setSets((prev) => prev.slice(0, -1));

    if (lastSet.id) {
      const result = await deleteSet(lastSet.id);
      if (result?.error) {
        setError(result.error);
      }
    }
  };

  const handleDeleteExercise = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteExerciseFromWorkout(workout_id, ex.id);
      if (result?.error) {
        setError(result.error);
      }
      setShowConfirm(false);
    });
  };

  const handleToggleComplete = async (index: number) => {
    const set = sets[index];
    const newCompleted = !set.completed;
    updateSet(index, { completed: newCompleted });

    const result = await saveSetToExercise({
      id: set.id || undefined,
      number: set.number,
      weight: set.weight,
      reps: set.reps,
      completed: newCompleted,
      exercise_id: ex.id,
    });

    if (result?.error) {
      setError(result.error);
      updateSet(index, { completed: !newCompleted }); 
      return;
    }

    if (result?.id) {
      updateSet(index, { id: result.id });
    }
  };

  const handleSaveNote = () => {
    setError(null);
    if (noteInput === ex.notes) return;
    startTransition(async () => {
      const result = await saveExerciseNote(ex.id, noteInput);
      if (result?.error) {
        setError(result.error);
      } else {
        setShowAddNote(false);
      }
    });
  };

  return (
    <>
      {showConfirm && (
        <div  className="fixed inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-surface w-full max-w-[400px] flex rounded-md border-2 border-border gap-4 items-center flex-col p-4 justify-center">
            {error && (
              <p className="text-red-500 font-bold text-sm bg-red-500/10 p-2 rounded">
                {error}
              </p>
            )}
            <TriangleAlert className="text-red-500" />
            <p className="font-bold">Delete Exercise ?</p>
            <p className="text-center text-sm text-text-muted">
              This will permanently delete "{ex.name}" and all associated sets.
              This cannot be undone.
            </p>
            <div className="flex gap-3 w-full flex-1 mt-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="border-border cursor-pointer border rounded-md flex py-1.5 justify-center flex-[0.5] hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExercise}
                disabled={isPending}
                className="border-border cursor-pointer hover:bg-red-500 transition-colors bg-red-700 text-white border rounded-md flex py-1.5 justify-center flex-[0.5] disabled:opacity-50 font-semibold"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddNote && (
        <div className="fixed inset-0 bg-background/70 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-surface w-full max-w-[400px] flex rounded-md border-2 border-border gap-4 flex-col p-4">
            {error && (
              <p className="text-red-500 font-bold text-sm bg-red-500/10 p-2 rounded">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">
              <p className="font-bold">Add note</p>
              <button
                onClick={() => {
                  setShowAddNote(false);
                  setNoteInput(ex.notes ?? "");
                  setError(null);
                }}
                className="text-text-muted hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="e.g. Felt strong today, increased weight on last set"
              rows={3}
              className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
            />

            <div className="flex gap-3 w-full">
              <button
                onClick={() => {
                  setShowAddNote(false);
                  setNoteInput(ex.notes ?? "");
                  setError(null);
                }}
                disabled={isPending}
                className="border-border cursor-pointer border rounded-md flex py-1.5 justify-center flex-1 hover:bg-surface-raised transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={isPending || ex.notes === noteInput}
                className="border-border cursor-pointer hover:bg-primary-hover transition-colors bg-primary text-white border rounded-md flex py-1.5 justify-center flex-1 disabled:opacity-50 font-semibold"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={ref}  style={{opacity: isDragSource ? 0.5 : 1}} className="flex flex-col rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div
          className="bg-surface-raised flex flex-col gap-1 p-4 cursor-pointer hover:bg-border/30 transition-colors"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <GripVertical ref={handleRef} className=" cursor-pointer hover:text-primary-hover transition-colors" size={18}/>
              <p className="font-bold text-foreground">{ex.name}</p>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${muscle.bg} ${muscle.text} ${muscle.border}`}
              >
                {ex.muscle_group.charAt(0).toUpperCase() + ex.muscle_group.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-3">
            
              {isOpen ? (
                <ChevronUp size={18} className="text-text-muted" />
              ) : (
                <ChevronDown size={18} className="text-text-muted" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                className="text-text-muted cursor-pointer hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {ex.notes ? (
            <p
              onClick={(e) => {
                e.stopPropagation();
                setShowAddNote(true);
              }}
              className="text-text-muted text-sm cursor-pointer w-fit hover:text-foreground"
            >
              {ex.notes}
            </p>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddNote(true);
              }}
              className="text-text-muted text-xs hover:text-primary text-left w-fit"
            >
              + Add note
            </button>
          )}
        </div>

        {/* Tábla */}
        {isOpen && (
          <>
            {sets.length === 0 ? (
              <button
                onClick={handleNewSet}
                className="flex bg-surface cursor-pointer text-text-muted hover:text-primary transition-all justify-center py-4 text-sm"
              >
                Tap to start exercise tracking...
              </button>
            ) : (
              <>
                <div className="grid grid-cols-[40px_80px_1fr_1fr_40px] items-center gap-2 font-bold text-xs uppercase text-text-muted bg-surface border-y border-border px-4 py-2">
                  <p>Set</p>
                  <p>Previous</p>
                  <p>Kg</p>
                  <p>Reps</p>
                  <p className="text-center">✓</p>
                </div>

                <div className="flex flex-col">
                  {sets.map((set, index) => (
                    <div
                      key={set.id || set.tempId}
                      className={`grid grid-cols-[40px_80px_1fr_1fr_40px] items-center gap-2 px-4 py-2.5 border-b border-border last:border-0 transition-colors ${
                        set.completed ? "bg-primary/5" : "bg-surface"
                      }`}
                    >
                      <p className="text-sm font-semibold text-text-muted">
                        {set.type === "warmup" ? "W" : set.number}
                      </p>

                      <p className="text-xs text-text-muted">{set.previous ?? "—"}</p>

                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                          updateSet(index, { weight: parseInt(e.target.value), completed: false })
                        }
                        placeholder="0"
                        className="w-full text-center text-sm font-semibold border border-border rounded-md py-1.5 bg-surface-raised focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      />

                      <input
                        type="number"
                        value={set.reps ?? ""}
                        onChange={(e) =>
                          updateSet(index, {
                            reps: e.target.value ? Number(e.target.value) : null,
                            completed: false,
                          })
                        }
                        placeholder="0"
                        className="w-full text-center text-sm font-semibold border border-border rounded-md py-1.5 bg-surface-raised focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      />

                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleComplete(index)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                            set.completed
                              ? "bg-primary border-primary text-white"
                              : "border-border text-transparent hover:border-primary"
                          }`}
                        >
                          <Check size={13} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex">
                  <button
                    onClick={handleRemoveLastSet}
                    className="flex items-center cursor-pointer justify-center gap-1.5 flex-[0.5] text-red-500 text-sm font-semibold py-3 hover:bg-red-500/5 transition-colors border-t border-dashed border-border"
                  >
                    <Minus size={14} />
                    Remove Set
                  </button>
                  <button
                    onClick={handleNewSet}
                    className="flex items-center cursor-pointer justify-center flex-[0.5] gap-1.5 text-primary text-sm font-semibold py-3 hover:bg-primary/5 transition-colors border-t border-dashed border-border"
                  >
                    <Plus size={14} />
                    Add Set
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ActiveExerciseCard;