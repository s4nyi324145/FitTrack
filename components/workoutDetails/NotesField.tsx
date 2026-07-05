"use client";

import { updateWorkoutNote } from "@/app/actions/workoutsActions";
import React, { useRef, useState } from "react";

type Props = {
  initialNotes?: string;
  workoutId: number;
};

const NotesField = ({ initialNotes, workoutId }: Props) => {
  const [notes, setNotes] = useState<string>(initialNotes || "");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (value: string) => {
    setNotes(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); 
    }

    timeoutRef.current = setTimeout(async () => {
      await updateWorkoutNote(workoutId, value);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add workout notes..."
        rows={2}
        className="p-3 w-full rounded-md border border-border bg-surface-raised text-sm text-foreground outline-none transition-colors placeholder:text-text-subtle focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 resize-none"
      />
    </div>
  );
};

export default NotesField;