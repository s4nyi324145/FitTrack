"use server";

import { auth } from "@/lib/auth";
import pool from "@/lib/pg";
import type { CreateExerciseInput } from "@/types";
import { error } from "console";
import { revalidatePath } from "next/cache";

export const uploadExercise = async (newExercise: CreateExerciseInput) => {
  try {
    if (
      !newExercise.equipment ||
      !newExercise.exercise_type ||
      !newExercise.muscle_group ||
      !newExercise.name
    ) {
      return { error: "Please fill out all fields" };
    }

    const session = await auth();
    const userId = session?.user?.id;

    const result = await pool.query(
      "INSERT INTO exercises (user_id,name,muscle_group,equipment,exercise_type,instructions,is_custom) VALUES ($1,$2,$3,$4,$5,$6, true) RETURNING *",
      [
        userId,
        newExercise.name,
        newExercise.muscle_group.toLowerCase(),
        newExercise.equipment.toLowerCase(),
        newExercise.exercise_type,
        newExercise.instructions,
      ],
    );

    revalidatePath("/exercises")

    return ({succes: true, newExercise: result.rows})

  } catch (error) {
    return ({error: "Server Error"})
  }
};
