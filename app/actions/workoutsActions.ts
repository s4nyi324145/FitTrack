"use server";

import { auth } from "@/lib/auth";
import pool from "@/lib/pg";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { checkAndUpdatePrs } from "./personalRecord";

export const deleteWorkoutById = async (workout_id: number) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Unauthorized" };
  }

  if (!workout_id || isNaN(workout_id) || workout_id < 0) {
    return { error: "Invalid workout_id" };
  }

  try {
    const result = await pool.query(
      "DELETE FROM workouts WHERE id = $1 AND user_id = $2",
      [workout_id, userId],
    );

    if (result.rowCount === 0) {
      return { error: "Workout not found or unauthorized" };
    }

    revalidatePath("/workouts");
    redirect("/workouts");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Server error" };
  }
};

export const editWorkoutById = async (workout_id: number,name: string,notes: string,) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Unauthorized" };
  if (!name.trim()) return { error: "Workout name is required" };

  try {
    const result = await pool.query(
      `UPDATE workouts 
       SET name = $1, notes = $2 
       WHERE id = $3 AND user_id = $4`,
      [name.trim(), notes.trim() || null, workout_id, userId],
    );

    if (result.rowCount === 0)
      return { error: "Workout not found or unauthorized" };

    revalidatePath(`/workouts/${workout_id}`);
    revalidatePath("/workouts");
    return { success: true };
  } catch (error) {
    return { error: "Server error" };
  }
};

export const createNewWorkout = async (hasActiveWorkout: boolean) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Unauthorized" };

  if (hasActiveWorkout) {
    return { error: "You already have an active workout. Please finish it before starting a new one." };
  }

  try {
    const result = await pool.query(
      `INSERT INTO workouts (user_id,name,started_at) VALUES ($1,$2, NOW()) RETURNING id `,
      [userId, "My workout"],
    );

    if (result.rowCount == 0) {
      return { error: "Can not create a new workout" };
    }

    const id = result.rows[0].id;
    redirect(`/workouts/${id}/active`);
    
  } catch (error) {
    console.error("Delete workout error:", error);
    if (isRedirectError(error)) throw error;
    return { error: "Server error" };
  }
};

export const addExerciseToWorkout = async (
  workout_id: number,
  id: number,
  order: number,
) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Unauthorized" };
  }

  if (!workout_id || isNaN(workout_id) || workout_id < 0) {
    return { error: "Invalid workout_id" };
  }

  try {
    await pool.query(
      "INSERT INTO workout_exercises (workout_id, exercise_id, sort_order) VALUES ($1,$2, $3) ",
      [workout_id, id, order],
    );
    revalidatePath(`/workouts/${workout_id}/active`);
  } catch (error) {
    console.error("Adding exercise to workout error:", error);
    return { error: "Server error" };
  }
};

export const deleteExerciseFromWorkout = async (
  workout_id: number,
  id: number,
) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Unauthorized" };
  }

  if (!workout_id || isNaN(workout_id) || workout_id < 0) {
    return { error: "Invalid workout_id" };
  }

  try {
    await pool.query(
      `DELETE FROM workout_exercises 
      WHERE id = $1 
      AND workout_id IN (SELECT id FROM workouts WHERE id = $2 AND user_id = $3)`,
      [id, workout_id, userId],
    );
    revalidatePath(`/workouts/${workout_id}/active`);
  } catch (error) {
    console.error("Delete exercise from workout error:", error);
    return { error: "Server error" };
  }
};

export const saveSetToExercise = async ({id,number,weight,reps,completed,exercise_id,}: {id?: number;number: number;weight: number;reps: number | null;completed: boolean;exercise_id: number;}) => {

  const session = await auth()
  const userId = session?.user?.id
  
  try {
    const ownerCheck = await pool.query(
      `SELECT 1 FROM workout_exercises we
   JOIN workouts w ON w.id = we.workout_id
   WHERE we.id = $1 AND w.user_id = $2`,
      [exercise_id, userId],
    );
    if (ownerCheck.rowCount === 0) return { error: "Unauthorized" };

    if (id) {
      await pool.query(
        `UPDATE sets SET weight_kg=$1, reps=$2, is_completed=$3, completed_at=NOW() 
         WHERE id=$4`,
        [weight, reps, completed, id],
      );
      return { success: true, id };
    } else {
      const result = await pool.query(
        `INSERT INTO sets (workout_exercise_id, set_number, weight_kg, reps, is_completed, completed_at) 
         VALUES ($1,$2,$3,$4,$5, NOW()) RETURNING id`,
        [exercise_id, number, weight, reps, completed],
      );
      return { success: true, id: result.rows[0].id };
    }
  } catch (error) {
    console.error("Save set error:", error);
    return { error: "Server error" };
  }
};

export const deleteSet = async (set_id: number) => {
  if (!set_id || isNaN(set_id)) return { error: "Invalid set id" };

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Unauthorized" };

  try {
    const result = await pool.query(
      `DELETE FROM sets 
       WHERE id = $1 
         AND workout_exercise_id IN (
           SELECT we.id FROM workout_exercises we
           JOIN workouts w ON w.id = we.workout_id
           WHERE w.user_id = $2
         )`,
      [set_id, userId],
    );

    if (result.rowCount === 0)
      return { error: "Set not found or unauthorized" };

    return { success: true };
  } catch (error) {
    console.error("Delete set error:", error);
    return { error: "Server error" };
  }
};

export const saveExerciseNote = async (id: number, note: string) => {
  if (!id || isNaN(id) || id < 0) return { error: "Invalid exercise Id" };

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Unauthorized" };

  try {
    const result = await pool.query(
      `UPDATE workout_exercises 
       SET notes = $1 
       WHERE id = $2 
         AND workout_id IN (SELECT id FROM workouts WHERE user_id = $3)
       RETURNING workout_id`,
      [note, id, userId],
    );

    if (result.rowCount === 0) return { error: "Not found or unauthorized" };

    revalidatePath(`/workouts/${result.rows[0].workout_id}/active`);
    return { success: true };
  } catch (error) {
    return { error: "Server error" };
  }
};

export const updateWorkoutName = async (id: number, name: string) => {
  if (!id || isNaN(id) || id < 0) return { error: "Invalid exercise Id" };

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Unauthorized" };

  try {
    const result = await pool.query(
      `UPDATE workouts 
       SET name = $1 
       WHERE id = $2 
         AND user_id = $3
       RETURNING id`,
      [name, id, userId],
    );

    if (result.rowCount === 0) return { error: "Not found or unauthorized" };

    revalidatePath(`/workouts/${result.rows[0].id}/active`);
    return { success: true };
  } catch (error) {
    console.error("Add note to exercise error:", error);
    return { error: "Server error" };
  }
};

export const updateWorkoutNote = async (id:number, note:string) => {

  if (!id || isNaN(id) || id < 0) return { error: "Invalid exercise Id" };
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return { error: "Unauthorized" };

  try {
      const result = await pool.query("UPDATE workouts SET notes = $1 WHERE id= $2 AND user_id = $3 RETURNING id", [note,id,userId])

       if (result.rowCount === 0) return { error: "Not found or unauthorized" }
      revalidatePath(`/workouts/${result.rows[0].id}/active`);
      return { success: true };


  }  catch (error) {
  console.error("Update workout note error:", error)
  return { error: "Server error" }
}

}

export const updateExerciseOrder = async (workout_id: number, orderedIds: number[]) => {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return { error: "Unauthorized" }

  try {

    //console.log(orderedIds);
    
   
    await Promise.all(
      orderedIds.map((exerciseId, idx) =>
        pool.query(
          `UPDATE workout_exercises SET sort_order = $1 
           WHERE id = $2 AND workout_id = $3`,
          [idx, exerciseId, workout_id]
        )
      )
    )



    return { success: true }
  } catch (error) {
    console.error("Update exercise order error:", error)
    return { error: "Server error" }
  }
}

export const finishWorkout = async (workout_id: number, started_at: Date,totalVolume: number,totalSets: number) => {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return { error: "Unauthorized" } 

   if (!workout_id || isNaN(workout_id) || workout_id < 0) return { error: "Invalid workout Id" };

    const now = new Date()
    const elapsedSeconds = Math.floor((now.getTime() - started_at.getTime()) / 1000)

  try {
    const result = await pool.query(
      `UPDATE workouts 
       SET finished_at = NOW(), duration_seconds = $1, total_volume_kg = $2, total_sets = $3
       WHERE id = $4 AND user_id = $5
       RETURNING id`,
      [elapsedSeconds,totalVolume,totalSets,workout_id,userId],
    );

    if (result.rowCount === 0) return { error: "Not found or unauthorized" }

    await checkAndUpdatePrs(workout_id)   
    
    return { success: true }
    
  } catch (error) {
    console.error("Finish workout error:", error)
    if (isRedirectError(error)) throw error;
    return { error: "Server error" }
  }
}