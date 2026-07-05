"use server"

import pool from "../pg"
import { auth } from "../auth"

export const getPrsByExId = async(exercise_id:number) => {

      const session = await auth()
  const userId = session?.user?.id
  if (!userId) return { error: "Unauthorized" }

  try {
    const result = await pool.query(
      `SELECT record_type, value:: int FROM personal_records 
       WHERE user_id = $1 AND exercise_id = $2`,
      [userId, exercise_id]
    )

    if(result.rowCount == 0) return { success: true, prs: [{
      record_type: "max_weight", value: null
    }, {
      record_type: "max_reps",
      value: null
    }, {
      record_type: "est_1rm",
      value: null
    }] }

    return { success: true, prs: result.rows }
  } catch (error) {
    return { error: "Server error" }
  }
}