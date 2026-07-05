export type InputFieldProps = {
  label: string;
  placeholder: string;
  value: string | number;
  type: string;
  showPassword?: boolean;
  setShowPassword?: (v: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};


export type Exercise = {
  id: number
  name: string
  name_hu?: string
  muscle_group: string
  equipment: string
  exercise_type: string
  instructions?: string
  tips?: string
  is_custom: boolean
  user_id?: number
  created_at?: string
}

export type CreateExerciseInput = Omit<Exercise, "id" | "is_custom" | "created_at" | "user_id">


export type FilterExercise= {
  name: string,
  muscle: string,
  equipment: string,
  sorted: string

}

export type RecentWorkout = {
  id: number
  name: string
  notes?: string
  started_at: Date
  finished_at?: Date
  created_at: Date
  template_id?: number
  user_id: number
  total_exercises: number
  total_sets: number
  total_volume_kg: number
  duration_seconds: number   
  primary_muscle?: string    
}

export type WorkoutDetail = {
  id: number;
  name: string;
  notes: string | null; 
  started_at: Date;
  duration: number
  total_sets: number
  finished_at: Date | null; 
  volume: string; 

  exercises: {
    id: number; // workout_exercises.id
    exercise_id: number; // exercises.id
    name: string;
    order: number;
    is_custom: number
    notes: string
    muscle_group: string
    
    sets: {
      id: number;
      number: number;
      type: string;
      weight: number; 
      reps: number | null;
      rpe: string | null;  
      completed: boolean;
    }[];
  }[]; 
};
export type WorkoutStats = {total_workouts: number, this_week_workouts: number, total_volume: number, avg_duration: number}

export type PersonalRecord = {
 record_type: string,
 value: number
}

export type ExerciseCard = {
 id: number;
 exercise_id: number;
 name: string;
 order: number;
 is_custom: number;
 notes?: string;
 muscle_group: string;
 sets: {
 id: number;
 number: number;
 type: string;
 weight: string;
 reps: number | null;
 rpe: string | null;
 completed: boolean;
 }[];
}

export type TemplateWorkout = {
  template_id: number;
  template_name: string;
  template_notes: string;
  exercises: {
    template_exercise_id: number;
    sort_order: number;
    default_sets: number;
    default_reps: number;
    default_weight_kg: number;
    exercise_id: number;
    exercise_name: string;
    muscle_group: string;
  }[];
}


