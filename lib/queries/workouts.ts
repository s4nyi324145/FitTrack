import { error } from "console";
import { auth } from "../auth";
import pool from "../pg";
import { WorkoutDetail } from "@/types";

export const getLastWorkout = async (userId: number) => {
  try {
    if (isNaN(userId)) return { error: "Invalid user id" };

    const response = await pool.query(
      "SELECT * FROM workouts WHERE user_id = $1 finished_at IS NOT NULL ORDER BY started_at DESC LIMIT 1 ",
      [userId],
    );

    return response.rows[0];
  } catch (error) {
    console.log(error);
    return { error: "Szerver error" };
  }
};

export const getWorkoutsData = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  try {
    const result = await pool.query(
      `SELECT 
    COALESCE(SUM(total_volume_kg), 0)::int AS "total_volume", 
    COUNT(id)::int AS "total_workouts", 
    COALESCE(AVG(duration_seconds), 0) AS "avg_duration", 
    (
        SELECT COUNT(id) 
        FROM workouts 
        WHERE user_id = $1 
          AND started_at >= DATE_TRUNC('week', NOW())
    ) AS "this_week_workouts"
    FROM workouts 
    WHERE user_id = $2;`,
      [userId, userId],
    );

    return result.rows[0];
  } catch (error) {
    return [];
  }
};

export const getRecentWorkouts = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const result = await pool.query(
      `
      SELECT 
        w.*,
        COUNT(we.id)::int AS total_exercises,
        (
          SELECT e.muscle_group 
          FROM workout_exercises we2
          JOIN exercises e ON e.id = we2.exercise_id
          WHERE we2.workout_id = w.id
          ORDER BY we2.sort_order ASC
          LIMIT 1
        ) AS primary_muscle
      FROM workouts w
      LEFT JOIN workout_exercises we ON w.id = we.workout_id
      WHERE w.user_id = $1
        AND w.started_at >= NOW() - INTERVAL '30 days'
      GROUP BY w.id
      ORDER BY w.started_at DESC
    `,
      [userId],
    );

    
    

    return result.rows;
  } catch (error) {
    console.log(error);

    return [];
  }
};

export const getWorkoutDetail = async (workourId: number) => {

  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return [];
  }

  try {
    const result = await pool.query(
      `SELECT 
    w.id AS workout_id,
    w.name AS workout_name,
    w.notes AS workout_notes,
    w.started_at,
    w.finished_at,
    w.duration_seconds AS duration,
    w.total_volume_kg,
    w.total_sets AS total_sets,
    e.is_custom AS is_custom,
    we.id AS workout_exercise_id,
    we.sort_order AS exercise_order,
    e.id AS exercise_id,
    e.name AS exercise_name,
    we.notes AS notes,
    e.muscle_group AS muscle_group,
    s.id AS set_id,
    s.set_number,
    s.set_type,
    s.weight_kg,
    s.reps,
    s.rpe,
    s.is_completed
    FROM workouts w
    LEFT JOIN workout_exercises we ON w.id = we.workout_id
    LEFT JOIN exercises e ON we.exercise_id = e.id
    LEFT JOIN sets s ON we.id = s.workout_exercise_id
    WHERE w.id = $1  AND w.user_id = $2
    ORDER BY we.sort_order ASC, s.set_number ASC;`,
      [workourId, userId],
    );

    const rows = result.rows;

    if (rows.length === 0) return []

  

    const workoutDetail: WorkoutDetail = {
      id: rows[0].workout_id,
      name: rows[0].workout_name,
      notes: rows[0].workout_notes,
      started_at: rows[0].started_at,
      finished_at: rows[0].finished_at,
      volume: rows[0].total_volume_kg,
      duration: rows[0].duration,
      total_sets: rows[0].total_sets,
      exercises: [] as any[],
    };

    rows.forEach((row) => {
      if (!row.workout_exercise_id) return [];

      let ex = workoutDetail.exercises.find(
        (e) => e.id == row.workout_exercise_id,
      );

      if (!ex) {
        ex = {
          id: row.workout_exercise_id,
          exercise_id: row.exercise_id,
          name: row.exercise_name,
          order: row.exercise_order,
          notes: row.notes,
          is_custom: row.is_custom,
          muscle_group: row.muscle_group,
          sets: [],
        };
        workoutDetail.exercises.push(ex)
      }

      if (row.set_id) {
        ex.sets.push({
          id: row.set_id,
          number: row.set_number,
          type: row.set_type,
          weight: parseInt(row.weight_kg),
          reps: row.reps,
          rpe: row.rpe,
          completed: row.is_completed,
        });
      }
    });

    return workoutDetail;
  } catch (error) {
    return [];
  }
};
